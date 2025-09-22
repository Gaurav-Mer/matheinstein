/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/bookings/availability.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/lib/firebaseAdmin";
import { z } from "zod";
import { startOfMonth, endOfMonth, parseISO } from "date-fns";

const querySchema = z.object({
    tutorId: z.string().min(1, "Tutor ID is required."),
    month: z.string().min(1, "Month is required (YYYY-MM-DD format)."),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const validatedData = querySchema.parse(req.query);
        const { tutorId, month } = validatedData;

        const startOfMonthDate = startOfMonth(parseISO(month));
        const endOfMonthDate = endOfMonth(parseISO(month));

        const bookingsSnapshot = await adminDb
            .collection("bookings")
            .where("tutorId", "==", tutorId)
            .where("startTime", ">=", startOfMonthDate)
            .where("startTime", "<=", endOfMonthDate)
            .where("status", "==", "upcoming") // Only filter out upcoming bookings
            .get();

        const bookedSlots = bookingsSnapshot.docs.map(doc => ({
            id: doc.id,
            startTime: (doc.data().startTime as any)?.toDate().toISOString(),
            endTime: (doc.data().endTime as any)?.toDate().toISOString(),
        }));

        return res.status(200).json(bookedSlots);

    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({ error: "Invalid data provided", details: error.issues });
        }
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}