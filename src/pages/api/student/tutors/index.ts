/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/student/tutors.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decodedToken = await adminAuth.verifyIdToken(token);
        const { uid: studentId } = decodedToken;

        const studentDoc = await adminDb.collection("users").doc(studentId).get();
        if (!studentDoc.exists || studentDoc.data()?.role !== "student") {
            return res.status(403).json({ error: "Forbidden" });
        }

        const studentData = studentDoc.data();
        const tutorId = studentData?.assignedTutorId;

        // If no tutor is assigned, return an empty array
        if (!tutorId) {
            return res.status(200).json([]);
        }

        // Fetch the assigned tutor's document directly
        const tutorDoc = await adminDb.collection("users").doc(tutorId).get();
        if (!tutorDoc.exists) {
            // Tutor not found, but student is still valid
            return res.status(200).json([]);
        }

        const tutorData = { uid: tutorDoc.id, ...tutorDoc.data() };
        return res.status(200).json([tutorData]);

    } catch (error: any) {
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}