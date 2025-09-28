/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/tutor/earnings.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

const PAYOUT_RATE_DEFAULT = 800; // Default fallback for historical data without a stored rate (₹800)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decodedToken = await adminAuth.verifyIdToken(token);
        const { uid: tutorId } = decodedToken;

        const tutorDoc = await adminDb.collection("users").doc(tutorId).get();
        if (tutorDoc.data()?.role !== "tutor") return res.status(403).json({ error: "Forbidden" });

        // 1. Fetch ALL completed bookings for this tutor
        const bookingsSnapshot = await adminDb
            .collection("bookings")
            .where("tutorId", "==", tutorId)
            .where("status", "==", "completed") // Only count finalized, compensable lessons
            .get();

        const completedBookings = bookingsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        // 2. Calculate Total Payout Liability
        const totalPayoutLiability = completedBookings.reduce((sum, booking: any) => {
            // CRITICAL: Sum the locked-in rate from the booking record itself.
            // This ensures the tutor is paid the rate that was active when the lesson was completed.
            const payoutRate = booking.tutorPayoutRate || PAYOUT_RATE_DEFAULT;
            return sum + payoutRate;
        }, 0);

        const totalCompletedLessons = completedBookings.length;

        // 3. Return the final audited data
        return res.status(200).json({
            totalCompletedLessons,
            totalPayoutLiability: Math.round(totalPayoutLiability),
            compensationCurrency: 'INR', // Explicitly state the currency
            transactions: completedBookings, // Return history for audit
        });

    } catch (error: any) {
        console.error("Tutor Earnings API error:", error);
        return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}