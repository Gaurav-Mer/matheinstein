/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/admin/demo-requests/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { normalizeArray } from "@/lib/utils";
import { FieldPath } from "firebase-admin/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decodedToken = await adminAuth.verifyIdToken(token);
        const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get();
        if (userDoc.data()?.role !== "admin") return res.status(403).json({ error: "Forbidden" });

        // 1. Fetch all unassigned demo requests (REQUIRED FIRST STEP)
        const demoRequestsSnapshot = await adminDb
            .collection("demoRequests")
            .where("status", "==", "unassigned")
            .orderBy("createdAt", "asc")
            .get();

        const demoRequests = demoRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 2. Collect UIDs and Subject IDs
        const studentUids = demoRequests.map((req: any) => req.studentId).filter(Boolean);
        const subjectIds = Array.from(new Set(demoRequests.map((req: any) => req.subjectId).filter(Boolean)));

        // 3. ⚠️ FETCH STUDENTS AND SUBJECTS IN PARALLEL ⚠️
        const [studentsSnapshot, subjectsSnapshot] = await Promise.all([
            // Fetch Students (only if UIDs exist)
            studentUids.length > 0
                ? adminDb.collection("users").where("uid", "in", studentUids).get()
                : Promise.resolve({ docs: [] }), // Return empty array if no UIDs

            // Fetch Subjects (only if IDs exist)
            subjectIds.length > 0
                ? adminDb.collection("subjects").where(FieldPath.documentId(), "in", subjectIds).get()
                : Promise.resolve({ docs: [] }), // Return empty array if no IDs
        ]);

        const studentsData = studentsSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
        const subjectsData = subjectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 4. Normalize Data
        const normalizedStudents = normalizeArray(studentsData, "uid");
        const normalizedSubjects: any = normalizeArray(subjectsData, "id");

        // 5. Enrich demo requests with student and subject name
        const enrichedDemoRequests = demoRequests.map((request: any) => ({
            ...request,
            student: normalizedStudents[request.studentId] || null,
            subjectName: normalizedSubjects[request.subjectId]?.name || 'N/A',
        }));

        return res.status(200).json(enrichedDemoRequests);

    } catch (error: any) {
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}