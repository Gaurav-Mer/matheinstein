/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/admin/profile.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { z } from "zod";

// Define a schema for updating the admin profile
const updateAdminProfileSchema = z.object({
    name: z.string().optional(),
    email: z.string().email("Invalid email address.").optional(),
    password: z.string().min(6, "Password must be at least 6 characters.").optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // A single function to get the authenticated user's ID
    const getAuthenticatedUid = async (token: string) => {
        const decodedToken = await adminAuth.verifyIdToken(token);
        const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get();
        if (userDoc.data()?.role !== "admin") {
            throw new Error("Forbidden: Not an admin account");
        }
        return userDoc.id;
    };

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        const uid = await getAuthenticatedUid(token);

        if (req.method === "GET") {
            const adminDoc = await adminDb.collection("users").doc(uid).get();
            if (!adminDoc.exists) return res.status(404).json({ error: "Admin profile not found" });
            const adminData = adminDoc.data();
            const profile = { uid: adminDoc.id, ...adminData };
            return res.status(200).json(profile);
        }

        if (req.method === "PATCH") {
            const validatedData = updateAdminProfileSchema.parse(req.body);

            if (validatedData.email || validatedData.password) {
                const authUpdate: any = {};
                if (validatedData.email) authUpdate.email = validatedData.email;
                if (validatedData.password) authUpdate.password = validatedData.password;
                await adminAuth.updateUser(uid, authUpdate);
            }

            const firestoreUpdate: any = { ...validatedData };
            delete firestoreUpdate.email;
            delete firestoreUpdate.password;

            if (Object.keys(firestoreUpdate).length > 0) {
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