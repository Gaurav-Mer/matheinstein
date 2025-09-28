/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/public/book-demo.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { z } from "zod";
import { Resend } from 'resend';
import nodemailer from "nodemailer";

// --- Configuration and Initialization ---
const resend = new Resend(process.env.RESEND_API_KEY);
const useLocalSmtp = process.env.NODE_ENV === "development";

// Ethereal/Nodemailer setup for local environment testing
const localTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'kadin.lueilwitz87@ethereal.email',
        pass: 'uCFJdXF5yVAg2MJjY3'
    }
});

// Define a schema that matches the data sent from the DemoBookingWizard
const publicDemoRequestSchema = z.object({
    studentName: z.string().min(2, "Your name is required."),
    studentEmail: z.string().email("A valid email is required."),
    subjectId: z.string().min(1, "Please select a subject."),
    requestedDateTime: z.string().datetime("Invalid date/time format."),
});


// --- Email Sending Function (Hybrid Logic) ---
const sendInvitationEmail = async (studentName: string, email: string, resetLink: string) => {
    const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Welcome to Your Platform!</title>
        </head>
        <body>
            <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee;">
                <h1>Welcome, ${studentName}!</h1>
                <p>Your demo request has been received. Please click the button below to set your password and access your new account:</p>
                <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Set Your Password</a>
                <p style="margin-top: 15px; font-size: 12px;">Link: ${resetLink}</p>
            </div>
        </body>
        </html>
    `;

    const mailOptions = {
        from: 'no-reply@yourplatform.com',
        to: email,
        subject: "Welcome! Set Your Password to Get Started",
        html: htmlTemplate,
    };

    if (useLocalSmtp) {
        // 🚨 Local Development: Sends to Ethereal inbox
        console.log("Sending email via local SMTP (Ethereal)...");
        const info = await localTransporter.sendMail(mailOptions);
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`); // Log Ethereal preview link
    } else {
        // Production: Sends via Resend API
        console.log("Sending email via Resend API...");
        await resend.emails.send(mailOptions);
    }
};

// --- Main Handler ---
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const validatedData = publicDemoRequestSchema.parse(req.body);
        const { studentEmail, studentName, subjectId, requestedDateTime } = validatedData;

        // 1. Create User in Firebase Auth (Passwordless Initial Account)
        let newUser;
        try {
            newUser = await adminAuth.createUser({
                email: studentEmail,
                displayName: studentName,
                emailVerified: false,
            });
        } catch (error: any) {
            if (error.code === 'auth/email-already-exists') {
                return res.status(409).json({ error: "An account with this email already exists. Please log in." });
            }
            throw error;
        }

        const studentId = newUser.uid;

        // 2. Create Student Profile in Firestore
        await adminDb.collection("users").doc(studentId).set({
            name: studentName,
            email: studentEmail,
            role: "student",
            status: "pending_demo",
            assignedTutorId: null,
            lessonCredits: 0,
            subjects: [subjectId],
            createdAt: new Date().toISOString(),
        });

        // 3. Create Demo Request for Admin Review
        await adminDb.collection("demoRequests").add({
            studentId,
            studentEmail,
            subjectId,
            requestedDateTime: new Date(requestedDateTime),
            status: 'unassigned',
            createdAt: new Date(),
        });

        // 4. Send Invitation Email (using hybrid logic)
        const resetLink = await adminAuth.generatePasswordResetLink(studentEmail);
        await sendInvitationEmail(studentName, studentEmail, resetLink);


        return res.status(201).json({ message: "Demo request received. Please check your email to set your password and confirm your slot." });

    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({ error: "Invalid data provided", details: error.issues });
        }
        if (error.code === 'auth/email-already-exists') {
            return res.status(409).json({ error: "An account with this email already exists. Please log in." });
        }
        console.error("Public Demo Request API error:", error);
        return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}