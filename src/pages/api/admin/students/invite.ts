/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/admin/students/invite.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { addStudentSchema } from "@/lib/schemas/studentSchema";
import { Resend } from 'resend';
import nodemailer from "nodemailer";

// Initialize the Resend client for production
const resend = new Resend(process.env.RESEND_API_KEY);
const useLocalSmtp = process.env.NODE_ENV === "development";

// Initialize a Nodemailer transporter for local testing
const localTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'ada.hyatt17@ethereal.email',
        pass: '9Whqy3nVxKAz3N6Nth'
    }
});


const sendInvitationEmail = async (studentName: string, email: string, resetLink: string) => {
    const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Your Platform!</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
                .header { background-color: #3b82f6; padding: 20px; text-align: center; color: #ffffff; font-size: 24px; font-weight: bold; }
                .content { padding: 40px; text-align: center; color: #333333; }
                .content p { font-size: 16px; line-height: 1.6; margin: 20px 0; }
                .button { display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; }
                .footer { padding: 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">Your Platform</div>
                <div class="content">
                    <h2>Welcome! You've been invited.</h2>
                    <p>Hi ${studentName},</p>
                    <p>Your account has been created on Your Platform. Please click the button below to set your password and get started with your lessons.</p>
                    <a href="${resetLink}" class="button" target="_blank">Set Your Password</a>
                    <p style="margin-top: 30px; font-size: 14px;">If the button doesn't work, copy and paste this link into your web browser:</p>
                    <p style="word-break: break-all; font-size: 12px;">${resetLink}</p>
                </div>
                <div class="footer">&copy; ${new Date().getFullYear()} Your Platform. All rights reserved.</div>
            </div>
        </body>
        </html>
    `;

    const mailOptions = {
        from: 'onboarding@yourplatform.com',
        to: email,
        subject: "Welcome! Set Your Password to Get Started",
        html: htmlTemplate,
    };

    if (useLocalSmtp) {
        console.log("Sending email via local SMTP...");
        await localTransporter.sendMail(mailOptions);
    } else {
        console.log("Sending email via Resend API...");
        await resend.emails.send(mailOptions);
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decoded = await adminAuth.verifyIdToken(token);
        const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
        if (userDoc.data()?.role !== "admin") return res.status(403).json({ error: "Forbidden" });

        const validatedData = addStudentSchema.pick({
            name: true,
            email: true,
            phone: true,
            subjects: true,
            parentDetails: true,
            assignedTutorId: true,
        }).parse(req.body);

        const newUser = await adminAuth.createUser({
            email: validatedData.email,
            displayName: validatedData.name,
        });

        // This line is corrected: newUser.email is guaranteed to exist
        const resetLink = await adminAuth.generatePasswordResetLink(newUser.email ?? "");

        await sendInvitationEmail(validatedData.name, validatedData.email, resetLink);

        await adminDb.collection("users").doc(newUser.uid).set({
            ...validatedData,
            role: "student",
            createdAt: new Date().toISOString(),
            status: "active"
        });

        return res.status(201).json({
            uid: newUser.uid,
            message: "Student account created and invitation sent successfully.",
            resetLink // For local testing, remove in production
        });
    } catch (error: any) {
        console.error("API error:", error);
        if (error.code === "auth/email-already-exists") {
            return res.status(409).json({ error: "An account with this email already exists." });
        }
        return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}