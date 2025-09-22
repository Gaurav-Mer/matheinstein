/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/student/profile.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { addStudentSchema } from "@/lib/schemas/studentSchema";
import { z } from "zod";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        const decodedToken = await adminAuth.verifyIdToken(token);
        const { uid } = decodedToken;

        const studentDoc = await adminDb.collection("users").doc(uid).get();
        if (studentDoc.data()?.role !== "student") return res.status(403).json({ error: "Forbidden" });

        // GET a single student's profile
        if (req.method === "GET") {
            if (!studentDoc.exists) return res.status(404).json({ error: "Student profile not found" });
            const studentData = studentDoc.data();
            const profile = { uid: studentDoc.id, ...studentData };
            return res.status(200).json(profile);
        }

        // PATCH to update a student's profile (safely)
        if (req.method === "PATCH") {
            // Use Zod to validate the partial update, but completely ignore password
            const updateSchema = addStudentSchema.partial().omit({ password: true });
            const validatedData = updateSchema.parse(req.body);

            // Update Firestore with the validated data
            if (Object.keys(validatedData).length > 0) {
                await adminDb.collection("users").doc(uid).update(validatedData);
            }

            return res.status(200).json({ message: "Profile updated successfully." });
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