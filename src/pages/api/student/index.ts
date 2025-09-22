/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/students/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        // 1. Verify student token for security
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        const decodedToken = await adminAuth.verifyIdToken(token);
        const { uid } = decodedToken;

        const studentDoc = await adminDb.collection("users").doc(uid).get();
        if (studentDoc.data()?.role !== "student") return res.status(403).json({ error: "Forbidden" });

        // 2. Fetch student's profile
        const studentProfile = { uid: studentDoc.id, ...(studentDoc.data() as { assignedTutorId?: string;[key: string]: any }) };

        // 3. Fetch the assigned tutor's data
        let assignedTutor = null;
        if (studentProfile?.assignedTutorId) {
            const tutorDoc = await adminDb.collection("users").doc(studentProfile.assignedTutorId).get();
            if (tutorDoc.exists) {
                const tutorData = tutorDoc.data();
                assignedTutor = { uid: tutorDoc.id, name: tutorData?.name, bio: tutorData?.bio };
            }
        }

        // 4. Fetch all upcoming bookings for this student
        const now = new Date();
        const bookingsSnapshot = await adminDb
            .collection("bookings")
            .where("studentId", "==", uid)
            .where("startTime", ">", now)
            .orderBy("startTime")
            .get();

        const upcomingBookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 5. Consolidate and return the data
        const dashboardData = {
            profile: studentProfile,
            tutor: assignedTutor,
            upcomingBookings,
        };

        return res.status(200).json(dashboardData);

    } catch (error: any) {
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}