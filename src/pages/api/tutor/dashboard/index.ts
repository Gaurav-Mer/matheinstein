/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { normalizeArray } from "@/lib/utils";

// Define the interface for a booking document
interface Booking {
    id: string;
    studentId: string;
    tutorId: string;
    startTime: any;
    endTime: any;
    subject: string;
    // Add other booking fields here
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        // 1. Verify tutor token for security
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decodedToken = await adminAuth.verifyIdToken(token);
        const { uid } = decodedToken;

        const tutorDoc = await adminDb.collection("users").doc(uid).get();
        if (tutorDoc.data()?.role !== "tutor") return res.status(403).json({ error: "Forbidden" });

        // 2. Fetch tutor's profile
        const tutorProfile = { uid: tutorDoc.id, ...tutorDoc.data() };

        // 3. Fetch all upcoming bookings for this tutor
        const now = new Date();
        const bookingsSnapshot = await adminDb
            .collection("bookings")
            .where("tutorId", "==", uid)
            .where("startTime", ">", now)
            .orderBy("startTime")
            .get();

        const upcomingBookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));

        // 4. Collect student UIDs from bookings to fetch their profiles
        const studentUids = new Set<string>();
        upcomingBookings.forEach((booking: any) => {
            studentUids.add(booking.studentId);
        });

        // 5. Fetch all student data in a single query
        const studentsData: any[] = [];
        if (studentUids.size > 0) {
            const studentUidsArray = Array.from(studentUids);
            const studentPromises = [];

            for (let i = 0; i < studentUidsArray.length; i += 10) {
                const chunk = studentUidsArray.slice(i, i + 10);
                studentPromises.push(
                    adminDb.collection("users").where("uid", "in", chunk).get()
                );
            }

            const studentSnapshots = await Promise.all(studentPromises);
            studentSnapshots.forEach(snapshot => {
                snapshot.forEach(doc => studentsData.push({ uid: doc.id, ...doc.data() }));
            });
        }

        const normalizedStudents = normalizeArray(studentsData, "uid");

        // 6. Enrich bookings with student data
        const enrichedBookings = upcomingBookings.map((booking: any) => ({
            ...booking,
            student: normalizedStudents[booking.studentId] || null,
        }));

        // 7. Return the consolidated data
        const dashboardData = {
            profile: tutorProfile,
            upcomingBookings: enrichedBookings,
            assignedStudents: studentsData,
        };

        return res.status(200).json(dashboardData);

    } catch (error: any) {
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}