/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/admin/demo-requests/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { z } from "zod";
import { Resend } from 'resend';
import nodemailer from "nodemailer";

const assignTutorSchema = z.object({
    tutorId: z.string().min(1, "Tutor ID is required."),
});

// Initialize email services
const resend = new Resend(process.env.RESEND_API_KEY);
const localTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'allie44@ethereal.email',
        pass: 'cu3SWSrzYXXAqvFqW4'
    }
});
const sendEmail = async (subject: string, to: string, html: string) => {
    const mailOptions = { from: 'onboarding@yourplatform.com', to, subject, html };
    if (process.env.NODE_ENV === "development") {
        await localTransporter.sendMail(mailOptions);
    } else {
        await resend.emails.send(mailOptions);
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PATCH") {
        res.setHeader("Allow", ["PATCH"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { id } = req.query;
        if (!id || typeof id !== "string") {
            return res.status(400).json({ error: "Demo request ID is required." });
        }
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decodedToken = await adminAuth.verifyIdToken(token);
        const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get();
        if (userDoc.data()?.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }
        const { tutorId } = assignTutorSchema.parse(req.body);
        const demoRequestRef = adminDb.collection("demoRequests").doc(id);
        const demoRequestDoc = await demoRequestRef.get();
        if (!demoRequestDoc.exists || demoRequestDoc.data()?.status !== "unassigned") {
            return res.status(404).json({ error: "Demo request not found or already assigned." });
        }

        const demoRequestData = demoRequestDoc.data();
        const tutorDoc = await adminDb.collection("users").doc(tutorId).get();
        const studentDoc = await adminDb.collection("users").doc(demoRequestData?.studentId).get();
        if (!tutorDoc.exists || !studentDoc.exists) {
            return res.status(404).json({ error: "Tutor or student not found." });
        }

        await demoRequestRef.update({ status: "assigned", tutorId, assignedAt: new Date() });
        const bookingRef = adminDb.collection("bookings").doc();
        await bookingRef.set({ ...demoRequestData, id: bookingRef.id, tutorId, status: "upcoming", createdAt: new Date() });

        const tutorName = tutorDoc.data()?.name;
        const studentName = studentDoc.data()?.name;
        const studentEmail = studentDoc.data()?.email;
        const tutorEmail = tutorDoc.data()?.email;
        const subject = demoRequestData?.subject;

        const studentEmailHtml = `
            <p>Hi ${studentName},</p>
            <p>Your demo for ${subject} has been assigned to a tutor! Your tutor is ${tutorName}.</p>
            <p>They will be in touch shortly to confirm your session.</p>
        `;
        const tutorEmailHtml = `
            <p>Hi ${tutorName},</p>
            <p>A new demo session has been assigned to you for ${subject}. Your student is ${studentName}.</p>
            <p>Please contact them to confirm the details.</p>
        `;

        await sendEmail("Demo Session Assigned!", studentEmail, studentEmailHtml);
        await sendEmail("New Demo Session Assigned", tutorEmail, tutorEmailHtml);

        return res.status(200).json({ message: "Tutor assigned and booking created successfully." });

    } catch (error: any) {
        if (error.name === "ZodError") return res.status(400).json({ error: "Invalid data provided", details: error.issues });
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}