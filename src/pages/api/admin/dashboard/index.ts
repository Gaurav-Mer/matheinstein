/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/admin/dashboard.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

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

        // 2. Fetch all the key metrics in parallel
        const [
            tutorsSnapshot,
            studentsSnapshot,
            bookingsSnapshot,
            demoRequestsSnapshot,
        ] = await Promise.all([
            adminDb.collection("users").where("role", "==", "tutor").get(),
            adminDb.collection("users").where("role", "==", "student").get(),
            adminDb.collection("bookings").where("startTime", ">", new Date()).get(),
            adminDb.collection("demoRequests").where("status", "==", "unassigned").get(),
        ]);

        const dashboardData = {
            totalTutors: tutorsSnapshot.size,
            totalStudents: studentsSnapshot.size,
            totalUpcomingBookings: bookingsSnapshot.size,
            pendingDemoRequests: demoRequestsSnapshot.size,
        };

        return res.status(200).json(dashboardData);

    } catch (error: any) {
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}