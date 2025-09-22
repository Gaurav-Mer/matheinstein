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

dayjs.extend(utc);
dayjs.extend(timezone);

const resend = new Resend(process.env.RESEND_API_KEY);
const useLocalSmtp = process.env.NODE_ENV === "development";

const localTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

const sendBookingEmail = async (studentName: string, studentEmail: string, tutorName: string, tutorEmail: string, bookingDetails: any) => {
    const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>New Booking Confirmation</title>
            <style>
                body { font-family: sans-serif; }
                .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>New Booking Confirmation</h1>
                <p>Hello ${tutorName},</p>
                <p>A new session has been booked with you by ${studentName}.</p>
                <p><strong>Subject:</strong> ${bookingDetails.subject}</p>
                <p><strong>Time:</strong> ${dayjs(bookingDetails.startTime).format('ddd, MMM D, YYYY')} at ${dayjs(bookingDetails.startTime).format('h:mm A')}</p>
                <p>We've also sent an email to ${studentName} to confirm the booking.</p>
                <p>Thank you.</p>
            </div>
        </body>
        </html>
    `;

    const studentMailOptions = {
        from: 'bookings@yourplatform.com',
        to: studentEmail,
        subject: "Your Session is Confirmed!",
        html: htmlTemplate.replace(tutorName, studentName).replace("Hello", "Hi"),
    };

    const tutorMailOptions = {
        from: 'bookings@yourplatform.com',
        to: tutorEmail,
        subject: "New Session Booked!",
        html: htmlTemplate,
    };

    if (useLocalSmtp) {
        await localTransporter.sendMail(studentMailOptions);
        await localTransporter.sendMail(tutorMailOptions);
    } else {
        await resend.emails.send(studentMailOptions);
        await resend.emails.send(tutorMailOptions);
    }
};

const bookingSchema = z.object({
    tutorId: z.string().min(1, "Tutor ID is required."),
    studentId: z.string().min(1, "Student ID is required."),
    subject: z.string().min(1, "Subject is required."),
    // Expecting and storing time in ISO string format (UTC)
    startTime: z.string().transform((str) => dayjs(str).toDate()),
    endTime: z.string().transform((str) => dayjs(str).toDate()),
    timeZone: z.string().min(1, "Timezone is required."),
});

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

        const validatedData = bookingSchema.parse({ ...req.body, studentId });

        // Convert the time to UTC before checking and saving
        const bookingStartTimeUtc = dayjs.tz(validatedData.startTime, validatedData.timeZone).utc().toDate();

        // 1. Check if the slot is already booked
        const existingBookingsSnapshot = await adminDb
            .collection("bookings")
            .where("tutorId", "==", validatedData.tutorId)
            .where("startTime", "==", bookingStartTimeUtc)
            .get();

        if (!existingBookingsSnapshot.empty) {
            return res.status(409).json({ error: "This slot is already booked." });
        }

        // 2. Fetch the tutor and student details in parallel
        const [tutorDoc, studentDoc] = await Promise.all([
            adminDb.collection("users").doc(validatedData.tutorId).get(),
            adminDb.collection("users").doc(studentId).get(),
        ]);

        const tutorData = tutorDoc.data();
        const studentData = studentDoc.data();

        if (!tutorData || !studentData) {
            return res.status(404).json({ error: "Tutor or student not found." });
        }

        // 3. Create the new booking document
        const bookingRef = adminDb.collection("bookings").doc();
        await bookingRef.set({
            id: bookingRef.id,
            tutorId: validatedData.tutorId,
            studentId: validatedData.studentId,
            subject: validatedData.subject,
            startTime: bookingStartTimeUtc,
            endTime: dayjs.tz(validatedData.endTime, validatedData.timeZone).utc().toDate(),
            status: "upcoming",
            createdAt: new Date(),
        });

        // 4. Send confirmation emails
        await sendBookingEmail(
            studentData.name,
            studentData.email,
            tutorData.name,
            tutorData.email,
            { ...validatedData, startTime: bookingStartTimeUtc }
        );

        return res.status(201).json({ message: "Booking created successfully." });

    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({ error: "Invalid data provided", details: error.issues });
        }
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}