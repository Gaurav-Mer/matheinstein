/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/admin/bookings.ts
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

// Zod schema for query parameters
const querySchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    userId: z.string().optional(),
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
        const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get();
        if (userDoc.data()?.role !== "admin") return res.status(403).json({ error: "Forbidden" });

        const { page, limit, status } = querySchema.parse(req.query) || {};
        const pageNum = parseInt(page as string, 10) || 1;
        const limitNum = parseInt(limit as string, 10) || 20;

        let query: any = adminDb.collection("bookings");

        // 1. Core Filtering Logic
        if (status === "completed") {
            query = query.where("status", "==", "completed").orderBy("endTime", "desc");
        } else if (status === "cancelled") {
            query = query.where("status", "==", "cancelled").orderBy("startTime", "desc");
        } else if (status === "rescheduled") {
            query = query.where("status", "==", "rescheduled").orderBy("startTime", "desc");
        } else if (status === "no_show") {
            query = query.where("status", "==", "no_show").orderBy("startTime", "desc");
        } else {
            // Default: 'Upcoming' (Future or Past Due, but not finalized)
            query = query.where("status", "==", "upcoming").orderBy("startTime", "asc");
        }

        // 2. Pagination
        const offset = (pageNum - 1) * limitNum;
        query = query.limit(limitNum).offset(offset);

        const bookingsSnapshot = await query.get();
        const bookings: Booking[] = bookingsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Booking));

        // 3. Data Enrichment: Collect All UIDs Involved in Bookings
        const userUids = new Set<string>();
        bookings.forEach(booking => {
            userUids.add(booking.studentId);
            if (booking.tutorId) userUids.add(booking.tutorId);
        });

        // 4. Fetch User Data (Students and Tutors involved in THIS list)
        const userUidsArray = Array.from(userUids);
        const uidChunks = userUidsArray.reduce((acc: string[][], uid) => {
            const last = acc[acc.length - 1];
            if (last.length < 10) {
                last.push(uid);
            } else {
                acc.push([uid]);
            }
            return acc;
        }, [[]]);

        const userPromises = uidChunks.map(chunk =>
            adminDb.collection("users").where("uid", "in", chunk).get()
        );

        const userSnapshots = await Promise.all(userPromises);
        const usersData: any[] = [];
        userSnapshots.forEach(snapshot =>
            snapshot.forEach(doc => usersData.push({ uid: doc.id, ...doc.data() }))
        );

        const normalizedUsers = normalizeArray(usersData, "uid");

        // 5. Final Enrichment
        const enrichedBookings = bookings.map(booking => ({
            ...booking,
            student: normalizedUsers[booking.studentId] || null,
            tutor: normalizedUsers[booking.tutorId] || null,
        }));

        // 6. 🚨 Optimized Return: Return only the necessary booking data and associated user profiles
        return res.status(200).json({ bookings: enrichedBookings, users: usersData });

    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({ error: "Invalid data provided", details: error.issues });
        }
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}