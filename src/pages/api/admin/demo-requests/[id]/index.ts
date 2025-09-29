/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/admin/demo-requests/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { z } from "zod";
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { Resend } from "resend";
import nodemailer from "nodemailer";

const assignTutorSchema = z.object({
    tutorId: z.string().min(1, "Tutor ID is required."),
});

const useLocalSmtp = process.env.NODE_ENV === "development";

const resend = new Resend(process.env.RESEND_API_KEY);

const localTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'kadin.lueilwitz87@ethereal.email',
        pass: 'uCFJdXF5yVAg2MJjY3'
    }
});;

// Assuming sendEmail function is defined with full logic
/**
 * Sends an email using a hybrid approach: Nodemailer (local) or Resend (production).
 * @param subject The email subject line.
 * @param to The recipient email address.
 * @param html The HTML content of the email.
 */
const sendEmail = async (subject: string, to: string, html: string) => {
    const mailOptions = {
        // IMPORTANT: Use a verified sender domain in Resend for production
        from: 'no-reply@yourplatform.com',
        to: to,
        subject: subject,
        html: html,
    };

    if (useLocalSmtp) {
        // 🚨 Local Development: Sends to a local/fake SMTP server
        console.log(`Sending email via local SMTP to: ${to}`);
        const info = await localTransporter.sendMail(mailOptions);
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`); // Essential for Ethereal
    } else {
        // Production: Sends via Resend API
        console.log(`Sending email via Resend API to: ${to}`);
        await resend.emails.send(mailOptions);
    }
};

// Initialize OAuth2 Client for Google Calendar Write
const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

// --- Calendar Write Logic (Outside Transaction) ---
const addEventToExternalCalendar = async (tutorId: string, studentEmail: string, tutorEmail: string, booking: any): Promise<string | undefined> => {
    try {
        const integrationDoc = await adminDb
            .collection("users").doc(tutorId).collection("integrations").doc("googleCalendar").get();
        const tokens = integrationDoc.data()?.tokens;

        if (!tokens) return undefined;

        oAuth2Client.setCredentials(tokens);
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: {
                summary: `DEMO: ${booking.subjectName} with ${studentEmail}`,
                start: { dateTime: booking.requestedDateTime },
                end: { dateTime: new Date(new Date(booking.requestedDateTime).getTime() + 60 * 60000).toISOString() }, // 60 min demo
                attendees: [
                    { email: studentEmail },
                    { email: tutorEmail },
                ],
                reminders: { useDefault: true },
            },
        });

        return response.data.id || undefined; // Return the Google Event ID
    } catch (error) {
        console.error('Error writing to Google Calendar:', error);
        return undefined;
    }
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PATCH") {
        res.setHeader("Allow", ["PATCH"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    let emailAndCalendarPayload: any;
    let newBookingRefId: string = ''; // Capture the new Booking ID for later update

    try {
        const { id: requestId } = req.query;
        if (!requestId || typeof requestId !== "string") {
            return res.status(400).json({ error: "Demo request ID is required." });
        }
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decodedToken = await adminAuth.verifyIdToken(token);
        const adminDoc = await adminDb.collection("users").doc(decodedToken.uid).get();
        if (adminDoc.data()?.role !== "admin") return res.status(403).json({ error: "Forbidden" });

        const { tutorId } = assignTutorSchema.parse(req.body);

        // 1. Fetch necessary data (outside transaction)
        const demoRequestDoc = await adminDb.collection("demoRequests").doc(requestId).get();
        const demoRequestData = demoRequestDoc.data();
        const studentId = demoRequestData?.studentId;
        const subjectId = demoRequestData?.subjectId;

        const [tutorDoc, studentDoc, subjectDoc] = await Promise.all([
            adminDb.collection("users").doc(tutorId).get(),
            adminDb.collection("users").doc(studentId).get(),
            adminDb.collection("subjects").doc(subjectId).get(),
        ]);

        if (!tutorDoc.exists || !studentDoc.exists || !subjectDoc.exists) {
            return res.status(404).json({ error: "Tutor, student, or subject data not found." });
        }

        // Prepare data for email and calendar write (uses fetched docs)
        emailAndCalendarPayload = {
            tutorName: tutorDoc.data()?.name,
            studentName: studentDoc.data()?.name,
            studentEmail: studentDoc.data()?.email,
            tutorEmail: tutorDoc.data()?.email,
            subjectName: subjectDoc.data()?.name,
            requestedDateTime: demoRequestData?.requestedDateTime.toDate().toISOString(),
            tutorId,
        };

        // 2. 🚨 START ATOMIC TRANSACTION 🚨 (Sets the critical database links)
        await adminDb.runTransaction(async (t) => {
            const demoRequestRef = adminDb.collection("demoRequests").doc(requestId);
            const studentProfileRef = adminDb.collection("users").doc(studentId);
            const bookingRef = adminDb.collection("bookings").doc();
            newBookingRefId = bookingRef.id;

            // a) Update Demo Request Status
            t.update(demoRequestRef, { status: "assigned", tutorId, assignedAt: new Date(), bookingId: newBookingRefId });

            // b) CRITICAL FIX: Update Student Profile State (Conversion Trigger)
            t.update(studentProfileRef, { assignedTutorId: tutorId, status: "active" });

            // c) Create FINAL Booking Record
            t.set(bookingRef, {
                ...demoRequestData,
                id: newBookingRefId,
                tutorId,
                status: "upcoming",
                createdAt: new Date(),
                isDemo: true, // ⬅️ ADDED THIS CRITICAL FLAG

            });
        });
        // 🚨 END ATOMIC TRANSACTION 🚨

        // 3. EXTERNAL ACTIONS (Outside Transaction - Safe to fail)
        const googleEventId = await addEventToExternalCalendar(
            tutorId,
            emailAndCalendarPayload.studentEmail,
            emailAndCalendarPayload.tutorEmail,
            { subjectName: emailAndCalendarPayload.subjectName, requestedDateTime: emailAndCalendarPayload.requestedDateTime }
        );

        // 4. Final Audit Trail: Update Firestore with the Google Event ID
        if (googleEventId) {
            await adminDb.collection("bookings").doc(newBookingRefId).update({
                calendarEventId: googleEventId
            });
        }

        // 5. Send Confirmation Email
        const { tutorName, studentName, studentEmail, tutorEmail, subjectName } = emailAndCalendarPayload;
        const studentEmailHtml = `<p>Hi ${studentName}, Your demo for ${subjectName} has been assigned to your new tutor, ${tutorName}.</p>`;
        const tutorEmailHtml = `<p>Hi ${tutorName}, A new demo session for ${subjectName} has been assigned to you. Student: ${studentName}.</p>`;

        await sendEmail("Demo Session Assigned!", studentEmail, studentEmailHtml);
        await sendEmail("New Demo Session Assigned", tutorEmail, tutorEmailHtml);


        return res.status(200).json({ message: "Tutor assigned and booking created successfully." });

    } catch (error: any) {
        if (error.name === "ZodError") return res.status(400).json({ error: "Invalid data provided", details: error.issues });
        console.error("API error:", error);
        return res.status(500).json({ error: error.message || "Failed to process assignment." });
    }
}