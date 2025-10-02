/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/student/bookings.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { normalizeArray } from "@/lib/utils";
import { z } from "zod";

interface Booking {
    id: string;
    studentId: string;
    tutorId: string;
    startTime: any;
    endTime: any;
    subject: string;
    status: string;
}

const querySchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    // 🚨 FIX: Added 'no_show' status for complete filtering
    status: z.enum(["upcoming", "completed", "cancelled", "rescheduled", "no_show"]).optional(),
}).optional();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decodedToken = await adminAuth.verifyIdToken(token);
        const { uid } = decodedToken;

        const studentDoc = await adminDb.collection("users").doc(uid).get();
        if (studentDoc.data()?.role !== "student") return res.status(403).json({ error: "Forbidden" });

        const { page, limit, status } = querySchema.parse(req.query) || {};
        const pageNum = parseInt(page as string, 10) || 1;
        const limitNum = parseInt(limit as string, 10) || 20;

        let query: any = adminDb.collection("bookings").where("studentId", "==", uid);
        const now = new Date();

        // --- Core Filtering Logic ---

        if (status === "completed") {
            // Completed: End time is in the past, and status is marked 'completed'
            query = query.where("status", "==", "completed").orderBy("endTime", "desc");
        } else if (status === "cancelled") {
            query = query.where("status", "==", "cancelled").orderBy("startTime", "desc");
        } else if (status === "rescheduled") {
            query = query.where("status", "==", "rescheduled").orderBy("startTime", "desc");
        } else if (status === "no_show") {
            query = query.where("status", "==", "no_show").orderBy("startTime", "desc");
        } else {
            // Default: Upcoming (Includes future sessions AND sessions that are past-due but not completed/cancelled)
            // This requires filtering on the status field which is set to 'upcoming'
            query = query.where("status", "==", "upcoming").orderBy("startTime", "asc");
        }

        // Note on 'Past Due': The logic above relies on the frontend filtering out sessions that are 
        // older than a certain point to prevent "lost" bookings. Since Firestore doesn't allow OR logic 
        // with two different time filters, the standard pattern is to rely on status: "upcoming" 
        // and allow the frontend to check if the startTime is actually in the past.

        const offset = (pageNum - 1) * limitNum;
        query = query.limit(limitNum).offset(offset);

        const bookingsSnapshot = await query.get();
        const bookings: Booking[] = bookingsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Booking));

        // --- Enrichment Logic (Remains the same) ---
        const tutorUids = new Set<string>();
        bookings.forEach(booking => {
            if (booking.tutorId) tutorUids.add(booking.tutorId);
        });

        const tutorsData: any[] = [];
        if (tutorUids.size > 0) {
            const tutorUidsArray = Array.from(tutorUids);
            const tutorPromises = [];

            for (let i = 0; i < tutorUidsArray.length; i += 10) {
                const chunk = tutorUidsArray.slice(i, i + 10);
                tutorPromises.push(
                    adminDb.collection("users").where("uid", "in", chunk).get()
                );
            }

            const tutorSnapshots = await Promise.all(tutorPromises);
            tutorSnapshots.forEach(snapshot => {
                snapshot.forEach(doc => tutorsData.push({ uid: doc.id, ...doc.data() }));
            });
        }

        const normalizedTutors = normalizeArray(tutorsData, "uid");

        const enrichedBookings = bookings.map(booking => ({
            ...booking,
            tutor: normalizedTutors[booking.tutorId] || null,
        }));

        return res.status(200).json(enrichedBookings);

    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({ error: "Invalid data provided", details: error.issues });
        }
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}