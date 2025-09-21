/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { normalizeArray } from "@/lib/utils";
import { isAfter, parseISO } from "date-fns";
import { z } from "zod";

// Define the interface for a booking document
interface Booking {
    id: string;
    studentId: string;
    tutorId: string;
    startTime: any;
    endTime: any;
    subject: string;
    status: string; // Add status field
}

// Zod schema for query parameters
const querySchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    userId: z.string().optional(),
    status: z.enum(["upcoming", "completed", "cancelled"]).optional(),
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

        const { page, limit, userId, status } = querySchema.parse(req.query) || {};
        const pageNum = parseInt(page as string, 10) || 1;
        const limitNum = parseInt(limit as string, 10) || 20;

        let query: any = adminDb.collection("bookings");
        const now = new Date();

        if (status === "completed") {
            query = query.where("endTime", "<", now).orderBy("endTime", "desc");
        } else if (status === "cancelled") {
            query = query.where("status", "==", "cancelled").orderBy("startTime");
        } else {
            // Default to 'upcoming' bookings
            query = query.where("startTime", ">=", now).orderBy("startTime");
        }

        // Use an array of UIDs for the 'in' query
        const bookingUsers: string[] = [];
        if (userId) {
            bookingUsers.push(userId);
            // Assuming you have a way to know if a user is a student or tutor to optimize the query
            // For now, we'll just filter on the client side based on the enriched data
        }

        const offset = (pageNum - 1) * limitNum;
        query = query.limit(limitNum).offset(offset);

        const bookingsSnapshot = await query.get();
        const bookings: Booking[] = bookingsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Booking));

        const userUids = new Set<string>();
        bookings.forEach(booking => {
            userUids.add(booking.studentId);
            if (booking.tutorId) userUids.add(booking.tutorId);
        });

        const usersData: any[] = [];
        if (userUids.size > 0) {
            const uidChunks = Array.from(userUids).reduce((acc: string[][], uid) => {
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
            userSnapshots.forEach(snapshot =>
                snapshot.forEach(doc => usersData.push({ uid: doc.id, ...doc.data() }))
            );
        }

        const normalizedUsers = normalizeArray(usersData, "uid");

        const enrichedBookings = bookings.map(booking => ({
            ...booking,
            student: normalizedUsers[booking.studentId] || null,
            tutor: normalizedUsers[booking.tutorId] || null,
        }));

        const allUsersSnapshot = await adminDb.collection('users').where('role', 'in', ['admin', 'tutor', 'student']).get();
        const allUsers = allUsersSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));

        return res.status(200).json({ bookings: enrichedBookings, users: allUsers });

    } catch (error: any) {
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}