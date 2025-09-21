/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/admin/tutors/[tutorId]/students.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { id: tutorId } = req.query;
        if (!tutorId || Array.isArray(tutorId)) {
            return res.status(400).json({ error: "Missing or invalid tutorId" });
        }

        // 1️⃣ Verify admin token
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decoded = await adminAuth.verifyIdToken(token);
        const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
        const userData = userDoc.data();
        console.log("userDAta is", userData)
        if (userData?.role !== "admin") return res.status(403).json({ error: "Forbidden" });

        // 2️⃣ Fetch the tutor's document to get the list of assigned student UIDs
        const tutorDoc = await adminDb.collection("users").doc(tutorId as string).get();
        if (!tutorDoc.exists) {
            return res.status(404).json({ error: "Tutor not found" });
        }

        const tutorData = tutorDoc.data();
        const studentUids = tutorData?.students?.map((s: any) => s.id) || []; // Assuming student IDs are stored in an array

        // 3️⃣ Fetch the detailed student documents
        const students: any = [];
        if (studentUids.length > 0) {
            // Firestore does not support 'in' queries on empty arrays, so check first
            const studentsSnapshot = await adminDb.collection("users").where(
                "uid", "in", studentUids
            ).get();
            studentsSnapshot.forEach((doc) => {
                students.push({ uid: doc.id, ...doc.data() });
            });
        }

        return res.status(200).json(students);
    } catch (error: any) {
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}