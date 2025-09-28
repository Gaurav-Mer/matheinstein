/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/admin/tutors/[uid].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { z } from "zod";
import { addTutorSchema } from "@/lib/schemas/tutorSchema";

// Define the global default payout rate for display and initial setup
const DEFAULT_PAYOUT_RATE = 70; // 70%

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // ⚠️ FIX: The route slug is usually accessed as 'uid' or 'id'. We must ensure it's accessed correctly.
    // Assuming the file is named [id].ts and the variable should be accessed as id.
    const { id: uid } = req.query;

    if (!uid || typeof uid !== "string") {
        return res.status(400).json({ error: "Tutor UID is required" });
    }

    try {
        // 1️⃣ Verify admin token and role
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decoded = await adminAuth.verifyIdToken(token);

        const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
        if (!userDoc.exists || userDoc.data()?.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        // 2️⃣ Handle GET for single tutor
        if (req.method === "GET") {
            const tutorDoc = await adminDb.collection("users").doc(uid).get();
            if (!tutorDoc.exists) return res.status(404).json({ error: "Tutor not found" });

            const tutorData = tutorDoc.data();

            // 🚨 FIX 1: Provide default payout rate for the frontend form
            const finalData = {
                uid: tutorDoc.id,
                ...tutorData,
                payoutPercentage: tutorData?.payoutPercentage || DEFAULT_PAYOUT_RATE
            };
            return res.status(200).json(finalData);
        }

        // 3️⃣ Handle PUT/PATCH to update a tutor
        if (req.method === "PUT" || req.method === "PATCH") {
            // Use Zod partial update schema
            const updateSchema = addTutorSchema.partial().extend({
                password: z.string().min(6).optional(),
            });
            const validatedData = updateSchema.parse(req.body);

            // Update Firebase Auth if email or password changed
            const authUpdate: any = {};
            if (validatedData.email) authUpdate.email = validatedData.email;
            if (validatedData.password) authUpdate.password = validatedData.password;

            if (Object.keys(authUpdate).length > 0) {
                await adminAuth.updateUser(uid, authUpdate);
            }

            // Update Firestore with the remaining profile/booking settings
            const firestoreUpdate: any = { ...validatedData };
            delete firestoreUpdate.email;
            delete firestoreUpdate.password;

            if (Object.keys(firestoreUpdate).length > 0) {
                // This now safely updates paidLessons, availability, and payoutPercentage.
                await adminDb.collection("users").doc(uid).update(firestoreUpdate);
            }

            return res.status(200).json({ message: "Tutor updated successfully" });
        }

        // 4️⃣ Handle DELETE to delete a tutor
        if (req.method === "DELETE") {
            // No changes needed here, logic is sound
            await adminAuth.deleteUser(uid);
            await adminDb.collection("users").doc(uid).delete();
            return res.status(200).json({ message: "Tutor deleted successfully" });
        }

        res.setHeader("Allow", ["GET", "PUT", "PATCH", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);

    } catch (error: any) {
        console.error("Tutor update error:", error);
        if (error.name === "ZodError") {
            return res.status(400).json({ error: "Invalid data provided", details: error.issues });
        }
        if (error.code === "auth/email-already-exists") {
            return res.status(409).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: error.message || "Internal server error" });
    }
}