/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/tutor/bookings.ts
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
    status: string;
}

const querySchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
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
        const { uid } = decodedToken;

        const tutorDoc = await adminDb.collection("users").doc(uid).get();
        if (tutorDoc.data()?.role !== "tutor") return res.status(403).json({ error: "Forbidden" });

        const { page, limit, status } = querySchema.parse(req.query) || {};
        const pageNum = parseInt(page as string, 10) || 1;
        const limitNum = parseInt(limit as string, 10) || 20;

        let query: any = adminDb.collection("bookings").where("tutorId", "==", uid);
        const now = new Date();

        if (status === "completed") {
            query = query.where("endTime", "<", now).orderBy("endTime", "desc");
        } else if (status === "cancelled") {
            query = query.where("status", "==", "cancelled").orderBy("startTime");
        } else {
            query = query.where("startTime", ">=", now).orderBy("startTime");
        }

        const offset = (pageNum - 1) * limitNum;
        query = query.limit(limitNum).offset(offset);

        const bookingsSnapshot = await query.get();
        const bookings: Booking[] = bookingsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Booking));

        const studentUids = new Set<string>();
        bookings.forEach(booking => {
            studentUids.add(booking.studentId);
        });

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

        const enrichedBookings = bookings.map(booking => ({
            ...booking,
            student: normalizedStudents[booking.studentId] || null,
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