/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/bookings.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { z } from "zod";
import { Resend } from 'resend';
import nodemailer from "nodemailer";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

dayjs.extend(utc);
dayjs.extend(timezone);

const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Nodemailer transporter for local testing
const localTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS, }
});

// Initialize OAuth2 Client for Google Calendar Write
const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

// --- ZOD Schemas ---
const bookingItemSchema = z.object({
    tutorId: z.string().min(1),
    subject: z.string().min(1),
    startTime: z.string().transform((str) => dayjs(str).toDate()),
    endTime: z.string().transform((str) => dayjs(str).toDate()),
    timeZone: z.string().min(1),
});
const bookingsListSchema = z.array(bookingItemSchema);

// --- 1. Email Logic (Consolidated Confirmation) ---
const sendBookingEmail = async (studentName: string, studentEmail: string, tutorName: string, tutorEmail: string, bookedSlots: any[], totalBooked: number) => {
    const firstBooking = bookedSlots[0];
    const subjectLine = `${totalBooked} Sessions Confirmed: ${firstBooking.subject}`;

    const htmlTemplate = (recipientName: string, isTutor: boolean) => {
        const greeting = isTutor ? `Hello ${recipientName},` : `Hi ${recipientName},`;
        const actionText = isTutor ? `A student has booked ${totalBooked} session(s) with you.` : `Your booking for ${totalBooked} session(s) is confirmed.`;

        // Generate list of all booked times
        const slotsHtml = bookedSlots.map((slot: any) =>
            `<li style="margin-left: 20px; padding-left: 5px; list-style-type: none;">${dayjs(slot.startTime).tz(slot.timeZone).format('ddd, MMM D')} at ${dayjs(slot.startTime).tz(slot.timeZone).format('h:mm A')}</li>`
        ).join('');

        return `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; background-color: white; border: 1px solid #eee; border-radius: 8px;">
                <div style="background-color: #3b82f6; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">${subjectLine}</h1>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 16px;">${greeting}</p>
                    <p style="font-size: 16px;">${actionText} Your first session is:</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                        <tr><td style="padding: 5px 10px; font-weight: bold;">Subject</td><td style="padding: 5px 10px;">${firstBooking.subject}</td></tr>
                        <tr><td style="padding: 5px 10px; font-weight: bold;">Tutor</td><td style="padding: 5px 10px;">${tutorName}</td></tr>
                        <tr><td style="padding: 5px 10px; font-weight: bold;">Total Sessions</td><td style="padding: 5px 10px; color: #3b82f6;">${totalBooked}</td></tr>
                    </table>

                    <h3 style="margin-top: 25px; font-size: 18px;">All Booked Slots:</h3>
                    <ul style="padding: 0; margin: 10px 0;">
                        ${slotsHtml}
                    </ul>
                </div>
            </div>
        `;
    };
    const useLocalSmtp = process.env.NODE_ENV
    if (useLocalSmtp) {
        await localTransporter.sendMail({ from: 'bookings@yourplatform.com', to: studentEmail, subject: subjectLine, html: htmlTemplate(studentName, false) });
        await localTransporter.sendMail({ from: 'bookings@yourplatform.com', to: tutorEmail, subject: subjectLine, html: htmlTemplate(tutorName, true) });
    } else {
        await resend.emails.send({ from: 'bookings@yourplatform.com', to: studentEmail, subject: subjectLine, html: htmlTemplate(studentName, false) });
        await resend.emails.send({ from: 'bookings@yourplatform.com', to: tutorEmail, subject: subjectLine, html: htmlTemplate(tutorName, true) });
    }
};

// --- 2. Calendar Write Logic ---
const addEventToExternalCalendar = async (tutorId: string, studentEmail: string, tutorEmail: string, booking: any): Promise<string | undefined> => {
    try {
        // ... (This function remains as defined in the previous response, but is a CRITICAL component) ...
        const integrationDoc = await adminDb
            .collection("users").doc(tutorId).collection("integrations").doc("googleCalendar").get();
        const tokens = integrationDoc.data()?.tokens;

        if (!tokens) return undefined;

        oAuth2Client.setCredentials(tokens);
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: {
                summary: `Platform Lesson: ${booking.subject} with ${studentEmail}`,
                start: { dateTime: booking.startTime.toISOString() },
                end: { dateTime: booking.endTime.toISOString() },
                attendees: [{ email: studentEmail }, { email: tutorEmail }],
            },
        });
        return response.data.id || undefined;
    } catch (error) {
        console.error('Error writing to Google Calendar:', error);
        return undefined;
    }
};

// --- Main Handler ---
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    // Variables needed outside of the transaction
    let newCreditBalance = 0;
    const successfulSlots: any[] = []; // To store created slots before final update

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decodedToken = await adminAuth.verifyIdToken(token);
        const { uid: studentId } = decodedToken;

        const validatedSlots = bookingsListSchema.parse(req.body);
        const totalSlotsRequested = validatedSlots.length;
        const tutorId = validatedSlots[0].tutorId;

        // Fetch user data (outside transaction)
        const [studentDoc, tutorDoc] = await Promise.all([
            adminDb.collection("users").doc(studentId).get(),
            adminDb.collection("users").doc(tutorId).get(),
        ]);
        const tutorData = tutorDoc.data();
        const studentData = studentDoc.data();
        if (!tutorData || !studentData) throw new Error("User data required for transaction.");


        // 3. START ATOMIC TRANSACTION (Credit Deduction & Conflict Check)
        await adminDb.runTransaction(async (t) => {
            const studentRef = adminDb.collection('users').doc(studentId);
            const studentSnap = await t.get(studentRef);

            // CRITICAL CHECK 1: Sufficient Credits
            if (!studentSnap.exists || (studentSnap.data()?.lessonCredits || 0) < totalSlotsRequested) {
                throw new Error("Insufficient credits for this booking.");
            }

            const currentCredits = studentSnap.data()?.lessonCredits || 0;
            newCreditBalance = currentCredits - totalSlotsRequested;

            // 4. Slot Conflicts and Booking Creation
            for (const slot of validatedSlots) {
                const bookingStartTimeUtc = dayjs.tz(slot.startTime, slot.timeZone).utc().toDate();
                const bookingEndTimeUtc = dayjs.tz(slot.endTime, slot.timeZone).utc().toDate();

                // Check for conflicts on this specific time
                const existingBookingsSnapshot = await adminDb
                    .collection("bookings")
                    .where("tutorId", "==", tutorId)
                    .where("startTime", "==", bookingStartTimeUtc)
                    .get();

                if (!existingBookingsSnapshot.empty) {
                    throw new Error(`Slot conflict detected at ${dayjs(slot.startTime).tz(slot.timeZone).format('p')}.`);
                }

                const newBookingRef = adminDb.collection("bookings").doc();
                const newBookingRecord = {
                    ...slot,
                    id: newBookingRef.id,
                    studentId,
                    status: "upcoming",
                    startTime: bookingStartTimeUtc,
                    endTime: bookingEndTimeUtc,
                    createdAt: new Date(),
                };

                // Add to transaction and log locally for external action
                t.set(newBookingRef, newBookingRecord);
                successfulSlots.push(newBookingRecord); // ⬅️ Log the slot that succeeded in the transaction
            }

            // Final Update: Deduct credits
            t.update(studentRef, { lessonCredits: newCreditBalance });
        });
        // 5. END TRANSACTION

        // 6. EXTERNAL ACTIONS (Outside Transaction - Final Sync)
        for (const booking of successfulSlots) {
            const googleEventId = await addEventToExternalCalendar(
                tutorId,
                studentData.email,
                tutorData.email,
                { subject: booking.subject, startTime: booking.startTime, endTime: booking.endTime }
            );

            // Final Audit Trail: Update the Firestore booking record with the Google Event ID
            if (googleEventId) {
                await adminDb.collection("bookings").doc(booking.id).update({
                    calendarEventId: googleEventId
                });
            }
        }

        // 7. Send Confirmation Email (Send one email listing all slots booked)
        await sendBookingEmail(
            studentData.name,
            studentData.email,
            tutorData.name,
            tutorData.email,
            successfulSlots, // Pass all booked slots
            totalSlotsRequested
        );

        return res.status(201).json({ message: "Booking created successfully.", creditsRemaining: newCreditBalance });

    } catch (error: any) {
        if (error.message.includes("Insufficient credits")) {
            return res.status(402).json({ error: error.message });
        }
        if (error.message.includes("Slot conflict detected")) {
            return res.status(409).json({ error: error.message });
        }
        if (error.name === "ZodError") {
            return res.status(400).json({ error: "Invalid data provided", details: error.issues });
        }
        console.error("Booking API error:", error);
        return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}