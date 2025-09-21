/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/admin/tutors/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { Resend } from 'resend';
import nodemailer from "nodemailer";
import { addTutorSchema } from "@/lib/schemas/tutorSchema";

const resend = new Resend(process.env.RESEND_API_KEY);

const localTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email', // or localhost, or your Mailtrap host
    port: 587,
    secure: false,
    auth: {
        user: 'allie44@ethereal.email',
        pass: 'cu3SWSrzYXXAqvFqW4'
    }
});

// A single function that handles email sending based on the environment
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
                    <p>Your tutor account has been created on Your Platform. Please click the button below to set your password and get started.</p>
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

    if (process.env.NODE_ENV === "development") {
        console.log("Sending email via local SMTP...");
        await localTransporter.sendMail(mailOptions);
    } else {
        console.log("Sending email via Resend API...");
        await resend.emails.send(mailOptions);
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // 1️⃣ Get the token from Authorization header
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        // 2️⃣ Verify the token
        const decoded = await adminAuth.verifyIdToken(token);

        // 3️⃣ Fetch user role from Firestore
        const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
        if (!userDoc.exists) return res.status(403).json({ error: "Forbidden" });

        const userData = userDoc.data();
        if (userData?.role !== "admin") return res.status(403).json({ error: "Forbidden" });

        // 4️⃣ Handle GET / POST
        if (req.method === "GET") {
            res.setHeader("Cache-Control", "no-store"); // always return fresh data
            const tutorsSnapshot = await adminDb.collection("users").where("role", "==", "tutor").get();
            const tutors = tutorsSnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
            return res.status(200).json(tutors);
        }


        // if (req.method === "POST") {
        //     const { email, name, subjects, status = "inactive", availability } = req.body;
        //     if (!email || !name) return res.status(400).json({ error: "Missing required fields" });

        //     // Create user in Firebase Auth
        //     const newUser = await adminAuth.createUser({ email, displayName: name });

        //     // Save in Firestore
        //     await adminDb.collection("users").doc(newUser.uid).set({
        //         role: "tutor",
        //         name,
        //         email,
        //         subjects: subjects || [],
        //         createdAt: new Date().toISOString(),
        //         status,
        //         availability
        //     });

        //     return res.status(201).json({ uid: newUser.uid, email, name, subjects: subjects || [] });
        // }


        if (req.method === "POST") {
            const validatedData = addTutorSchema.pick({
                email: true,
                name: true,
                subjects: true,
                status: true,
                availability: true,
                timeZone: true,
                bufferTime: true,
                sessionDuration: true,
                bookingWindow: true,
            }).parse(req.body);

            const newUser = await adminAuth.createUser({
                email: validatedData.email,
                displayName: validatedData.name,
            });

            const resetLink = await adminAuth.generatePasswordResetLink(newUser.email ?? "");

            await sendInvitationEmail(validatedData.name, validatedData.email, resetLink);

            await adminDb.collection("users").doc(newUser.uid).set({
                ...validatedData,
                role: "tutor",
                createdAt: new Date().toISOString(),
                status: validatedData.status || "onboarding"
            });

            return res.status(201).json({ uid: newUser.uid, ...validatedData });
        }


        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    } catch (error: any) {
        console.error("Firebase createUser error:", error);

        if (error.code === "auth/email-already-exists") {
            return res.status(409).json({ error: "Email already exists" }); // 409 Conflict
        }

        return res.status(500).json({ error: "Internal Server Error" });
    }
}
