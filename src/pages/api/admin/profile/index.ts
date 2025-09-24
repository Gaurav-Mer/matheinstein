/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/admin/profile.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { z } from "zod";
// Assuming you have the comprehensive schema for admin that includes all tutor fields
import { adminSchema } from "@/lib/schemas/adminSchema";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // A function to securely get the authenticated admin's ID
    const getAuthenticatedUid = async (token: string) => {
        const decodedToken = await adminAuth.verifyIdToken(token);
        const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get();
        // The check remains simple for this specific endpoint
        if (userDoc.data()?.role !== "admin") {
            throw new Error("Forbidden: Not an admin account");
        }
        return userDoc.id;
    };

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        const uid = await getAuthenticatedUid(token);

        // GET: Fetch the complete profile
        if (req.method === "GET") {
            const adminDoc = await adminDb.collection("users").doc(uid).get();
            if (!adminDoc.exists) return res.status(404).json({ error: "Admin profile not found" });
            const adminData = adminDoc.data();
            const profile = { uid: adminDoc.id, ...adminData };
            return res.status(200).json(profile);
        }

        // PATCH: Update the profile, availability, and packages
        if (req.method === "PATCH") {
            // Use a partial of the full adminSchema to accept any field from the tabs
            const updateSchema = adminSchema.partial().extend({
                password: z.string().min(6, "Password must be at least 6 characters.").optional(),
            });
            const validatedData = updateSchema.parse(req.body);

            // Handle Firebase Auth Update (Email and Password)
            const authUpdate: any = {};
            if (validatedData.email) authUpdate.email = validatedData.email;
            if (validatedData.password) authUpdate.password = validatedData.password;

            if (Object.keys(authUpdate).length > 0) {
                await adminAuth.updateUser(uid, authUpdate);
            }

            // Update Firestore with the remaining profile and booking settings
            const firestoreUpdate: any = { ...validatedData };
            delete firestoreUpdate.email;
            delete firestoreUpdate.password;

            if (Object.keys(firestoreUpdate).length > 0) {
                // This now safely updates name, phone, bio, subjects, paidLessons, availability, etc.
                await adminDb.collection("users").doc(uid).update(firestoreUpdate);
            }

            return res.status(200).json({ message: "Profile updated successfully." });
        }

        res.setHeader("Allow", ["GET", "PATCH"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);

    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({ error: "Invalid data provided", details: error.issues });
        }
        if (error.message.includes("Forbidden")) {
            return res.status(403).json({ error: error.message });
        }
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}