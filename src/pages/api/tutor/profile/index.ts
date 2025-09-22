/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/tutor/profile.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { addTutorSchema } from "@/lib/schemas/tutorSchema";
import { z } from "zod";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decodedToken = await adminAuth.verifyIdToken(token);
        const { uid } = decodedToken;

        const tutorDoc = await adminDb.collection("users").doc(uid).get();
        if (tutorDoc.data()?.role !== "tutor") return res.status(403).json({ error: "Forbidden" });

        // GET a single tutor's profile
        if (req.method === "GET") {
            if (!tutorDoc.exists) return res.status(404).json({ error: "Tutor not found" });
            return res.status(200).json({ uid: tutorDoc.id, ...tutorDoc.data() });
        }

        // PATCH to update a tutor's profile
        if (req.method === "PATCH") {
            const updateSchema = addTutorSchema.partial().extend({
                password: z.string().min(6).optional(),
            });
            const validatedData = updateSchema.parse(req.body);

            const authUpdate: any = {};
            if (validatedData.email) authUpdate.email = validatedData.email;
            if (validatedData.password) authUpdate.password = validatedData.password;

            if (Object.keys(authUpdate).length > 0) {
                await adminAuth.updateUser(uid, authUpdate);
                delete validatedData.email;
                delete validatedData.password;
            }

            if (Object.keys(validatedData).length > 0) {
                await adminDb.collection("users").doc(uid).update(validatedData);
            }

            return res.status(200).json({ message: "Profile updated successfully" });
        }

        res.setHeader("Allow", ["GET", "PATCH"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({ error: "Invalid data provided", details: error.issues });
        }
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}