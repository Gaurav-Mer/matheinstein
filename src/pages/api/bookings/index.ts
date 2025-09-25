/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/bookings.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { z } from "zod";
import { Resend } from 'resend';
import nodemailer from "nodemailer";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

dayjs.extend(utc);
dayjs.extend(timezone);

const resend = new Resend(process.env.RESEND_API_KEY);
const useLocalSmtp = process.env.NODE_ENV === "development";
const localTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS, }
});

// Initialize OAuth2 Client using environment variables for calendar write
const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

// --- Email Logic ---
const sendBookingEmail = async (studentName: string, studentEmail: string, tutorName: string, tutorEmail: string, bookingDetails: any) => {
    const timeInTutorTz = dayjs(bookingDetails.startTime).tz(bookingDetails.timeZone).format('h:mm A');
    const date = dayjs(bookingDetails.startTime).format('ddd, MMM D, YYYY');

    const htmlTemplate = `...`; // Use your full HTML template for a professional look

    const mailOptions = {
        from: 'bookings@yourplatform.com',
        subject: `New Lesson Booked: ${bookingDetails.subject}`,
        html: `<p>A new session has been booked with you by ${studentName}. Time: ${date} at ${timeInTutorTz} (${bookingDetails.timeZone}).</p>`,
    };

    if (useLocalSmtp) {
        await localTransporter.sendMail({ ...mailOptions, to: studentEmail });
        await localTransporter.sendMail({ ...mailOptions, to: tutorEmail });
    } else {
        await resend.emails.send({ ...mailOptions, to: studentEmail });
        await resend.emails.send({ ...mailOptions, to: tutorEmail });
    }
};

// --- Calendar Write Logic ---
const addEventToExternalCalendar = async (tutorId: string, studentEmail: string, tutorEmail: string, booking: any) => {
    try {
        const integrationDoc = await adminDb
            .collection("users").doc(tutorId).collection("integrations").doc("googleCalendar").get();
        const tokens = integrationDoc.data()?.tokens;

        if (!tokens) return;

        oAuth2Client.setCredentials(tokens);
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

        await calendar.events.insert({
            calendarId: 'primary',
            requestBody: {
                summary: `Platform Lesson: ${booking.subject} with ${studentEmail}`,
                start: { dateTime: booking.startTime.toISOString() },
                end: { dateTime: booking.endTime.toISOString() },
                attendees: [{ email: studentEmail }, { email: tutorEmail }],
            },
        });
        console.log(`Event pushed successfully to Google Calendar for Tutor ${tutorId}.`);
    } catch (error) {
        console.error('Error writing to Google Calendar:', error);
    }
};


const bookingSchema = z.object({
    tutorId: z.string().min(1),
    subject: z.string().min(1),
    startTime: z.string().transform((str) => dayjs(str).toDate()),
    endTime: z.string().transform((str) => dayjs(str).toDate()),
    timeZone: z.string().min(1),
});

// Assuming a multi-slot booking where the request body is an array of slots
const bookingsListSchema = z.array(bookingSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decodedToken = await adminAuth.verifyIdToken(token);
        const { uid: studentId } = decodedToken;

        // Validation for the array of booking slots
        const validatedSlots = bookingsListSchema.parse(req.body);
        const totalSlotsRequested = validatedSlots.length;
        const tutorId = validatedSlots[0].tutorId; // All slots must be for the same tutor

        // Fetch user data (outside transaction)
        const [tutorDoc, studentDoc] = await Promise.all([
            adminDb.collection("users").doc(tutorId).get(),
            adminDb.collection("users").doc(studentId).get(),
        ]);
        const tutorData = tutorDoc.data();
        const studentData = studentDoc.data();
        if (!tutorData || !studentData) throw new Error("User data required for transaction.");


        // 1. START ATOMIC TRANSACTION (Credit Deduction & Conflict Check)
        let newCreditBalance = 0;
        await adminDb.runTransaction(async (t) => {
            const studentRef = adminDb.collection('users').doc(studentId);
            const studentSnap = await t.get(studentRef);

            // 🚨 CRITICAL CHECK 1: Sufficient Credits
            if (!studentSnap.exists || (studentSnap.data()?.lessonCredits || 0) < totalSlotsRequested) {
                throw new Error("Insufficient credits for this booking.");
            }

            const currentCredits = studentSnap.data()?.lessonCredits || 0;
            newCreditBalance = currentCredits - totalSlotsRequested;

            // 🚨 CRITICAL CHECK 2: Slot Conflicts and Booking Creation
            for (const slot of validatedSlots) {
                const bookingStartTimeUtc = dayjs.tz(slot.startTime, slot.timeZone).utc().toDate();

                const existingBookingsSnapshot = await adminDb
                    .collection("bookings")
                    .where("tutorId", "==", tutorId)
                    .where("startTime", "==", bookingStartTimeUtc)
                    .get();

                if (!existingBookingsSnapshot.empty) {
                    throw new Error(`Slot conflict detected at ${dayjs(slot.startTime).tz(slot.timeZone).format('p')}.`);
                }

                t.set(adminDb.collection("bookings").doc(), {
                    ...slot,
                    studentId,
                    status: "upcoming",
                    startTime: bookingStartTimeUtc,
                    endTime: dayjs.tz(slot.endTime, slot.timeZone).utc().toDate(),
                    createdAt: new Date(),
                });
            }

            // Final Update: Deduct credits
            t.update(studentRef, { lessonCredits: newCreditBalance });
        });
        // 2. END TRANSACTION

        // 3. EXTERNAL ACTIONS (Outside Transaction - Safe to fail)
        // Only trigger the external calendar write for the FIRST slot for simplicity, or loop through all
        await addEventToExternalCalendar(
            tutorId,
            studentData.email,
            tutorData.email,
            { ...validatedSlots[0], startTime: validatedSlots[0].startTime, endTime: validatedSlots[0].endTime }
        );

        // 4. Send Confirmation Email
        await sendBookingEmail(
            studentData.name,
            studentData.email,
            tutorData.name,
            tutorData.email,
            { ...validatedSlots[0] } // Send details of the first booking for confirmation
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