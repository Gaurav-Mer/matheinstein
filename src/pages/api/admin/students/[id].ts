/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/admin/students/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { addStudentSchema } from "@/lib/schemas/studentSchema";
import { z } from "zod";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Student ID is required" });
    }

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decodedToken = await adminAuth.verifyIdToken(token);
        const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get();
        if (userDoc.data()?.role !== "admin") return res.status(403).json({ error: "Forbidden" });

        // GET a single student
        if (req.method === "GET") {
            const studentDoc = await adminDb.collection("users").doc(id).get();
            if (!studentDoc.exists || studentDoc.data()?.role !== "student") {
                return res.status(404).json({ error: "Student not found" });
            }
            return res.status(200).json({ uid: studentDoc.id, ...studentDoc.data() });
        }

        // PATCH to update a student's profile
        if (req.method === "PATCH") {
            const updateSchema = addStudentSchema.partial().extend({
                password: z.string().min(6).optional(),
            });
            const validatedData = updateSchema.parse(req.body);

            // Handle password update separately for Firebase Auth
            if (validatedData.password) {
                await adminAuth.updateUser(id, { password: validatedData.password });
                delete validatedData.password; // Remove from Firestore update
            }

            // Perform Firestore update if there's data left
            if (Object.keys(validatedData).length > 0) {
                await adminDb.collection("users").doc(id).update(validatedData);
            }

            return res.status(200).json({ message: "Student updated successfully." });
        }

        // DELETE a student
        if (req.method === "DELETE") {
            await adminAuth.deleteUser(id);
            await adminDb.collection("users").doc(id).delete();
            return res.status(200).json({ message: "Student deleted successfully." });
        }

        res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    } catch (error: any) {
        console.error("API error:", error);
        if (error.name === "ZodError") {
            return res.status(400).json({ error: "Invalid data provided", details: error.issues });
        }
        return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}