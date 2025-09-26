/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/public/demo-slots.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/lib/firebaseAdmin";
import { z } from "zod";
import { startOfMonth, endOfMonth, parseISO } from "date-fns";

const querySchema = z.object({
    userId: z.string().min(1, "User ID is required."),
    month: z.string().min(1, "Month is required (YYYY-MM-DD format)."),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const validatedData = querySchema.parse(req.query);
        const { userId, month } = validatedData;

        // 1. Fetch User Data and Validate Role (CRITICAL SECURITY CHECK)
        const userDoc = await adminDb.collection("users").doc(userId).get();
        const userData = userDoc.data();

        // Ensure the user exists and has a scheduling role (admin or tutor)
        if (!userDoc.exists || !['admin', 'tutor'].includes(userData?.role)) {
            return res.status(403).json({ error: "Forbidden: User is not a designated scheduler." });
        }

        // 2. Fetch Booked Slots (same logic as internal availability check)
        const startOfMonthDate = startOfMonth(parseISO(month));
        const endOfMonthDate = endOfMonth(parseISO(month));

        const bookingsSnapshot = await adminDb
            .collection("bookings")
            .where("tutorId", "==", userId) // Use userId as the tutorId for consistency
            .where("startTime", ">=", startOfMonthDate)
            .where("startTime", "<=", endOfMonthDate)
            .where("status", "==", "upcoming")
            .get();

        const bookedSlots = bookingsSnapshot.docs.map(doc => ({
            id: doc.id,
            startTime: (doc.data().startTime as any)?.toDate().toISOString(),
            endTime: (doc.data().endTime as any)?.toDate().toISOString(),
            type: 'internal_booking',
        }));

        // 3. Return Availability Profile and Booked Slots
        return res.status(200).json({
            // Send back the essential scheduling profile (Availability is needed for slot generation)
            profile: {
                uid: userId,
                timeZone: userData?.timeZone || 'UTC',
                availability: userData?.availability || [],
            },
            bookedSlots: bookedSlots,
        });

    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({ error: "Invalid parameters provided." });
        }
        console.error("Public Demo Slots API error:", error);
        return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}