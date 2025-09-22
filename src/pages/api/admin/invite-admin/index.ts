/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/admin/invite-admin.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { Resend } from 'resend';
import { z } from "zod";

// Define a simple schema for the invitation
const inviteAdminSchema = z.object({
    name: z.string().min(2, "Name is required."),
    email: z.string().email("Invalid email address."),
});

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

const sendInvitationEmail = async (adminName: string, email: string, resetLink: string) => {
    // ... (Use the same HTML template from our previous conversation, with updated text) ...
    const htmlTemplate = `
        <p>Hello ${adminName},</p>
        <p>You have been invited to join the platform as an administrator. Please click the link below to set your password and get started:</p>
        <a href="${resetLink}">Set Your Password</a>
        <p>If you have any questions, please contact support.</p>
    `;

    await resend.emails.send({
        from: 'no-reply@yourplatform.com',
        to: email,
        subject: "Admin Invitation: Set Your Password",
        html: htmlTemplate,
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        // 1. Verify token and check for a 'super-admin' role
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decoded = await adminAuth.verifyIdToken(token);
        const userDoc = await adminDb.collection("users").doc(decoded.uid).get();

        // This is a crucial security check: only a super-admin can invite new admins
        if (userDoc.data()?.role !== "super-admin") {
            return res.status(403).json({ error: "Forbidden: Only a super-admin can invite new admins." });
        }

        // 2. Validate request body
        const { name, email } = inviteAdminSchema.parse(req.body);

        // 3. Create a new user in Firebase Auth without a password
        const newUser = await adminAuth.createUser({ email, displayName: name });
        const resetLink = await adminAuth.generatePasswordResetLink(newUser.email ?? "");

        // 4. Send the invitation email
        await sendInvitationEmail(name, email, resetLink);

        // 5. Save the user's data in Firestore
        await adminDb.collection("users").doc(newUser.uid).set({
            name,
            email,
            role: "admin", // The new user is given the 'admin' role
            createdAt: new Date().toISOString(),
        });

        return res.status(201).json({ uid: newUser.uid, message: "Admin invited successfully." });

    } catch (error: any) {
        if (error.code === "auth/email-already-exists") {
            return res.status(409).json({ error: "An account with this email already exists." });
        }
        return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}