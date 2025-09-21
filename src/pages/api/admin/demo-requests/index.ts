/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/admin/demo-requests.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { normalizeArray } from "@/lib/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        // 1. Verify admin token for security
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decodedToken = await adminAuth.verifyIdToken(token);
        const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get();
        if (userDoc.data()?.role !== "admin") return res.status(403).json({ error: "Forbidden" });

        // 2. Fetch all unassigned demo requests
        const demoRequestsSnapshot = await adminDb
            .collection("demoRequests")
            .where("status", "==", "unassigned")
            .orderBy("createdAt", "asc")
            .get();

        const demoRequests = demoRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 3. Collect student UIDs to fetch their profile data
        const studentUids = demoRequests.map((req: any) => req.studentId);

        let studentsData: any[] = [];
        if (studentUids.length > 0) {
            const studentsSnapshot = await adminDb.collection("users").where(
                "uid", "in", studentUids
            ).get();
            studentsData = studentsSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
        }

        const normalizedStudents = normalizeArray(studentsData, "uid");

        // 4. Enrich demo requests with student data
        const enrichedDemoRequests = demoRequests.map((request: any) => ({
            ...request,
            student: normalizedStudents[request.studentId] || null,
        }));

        return res.status(200).json(enrichedDemoRequests);

    } catch (error: any) {
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}