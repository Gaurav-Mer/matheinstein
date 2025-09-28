/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/admin/earnings.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { normalizeArray } from "@/lib/utils";

const PAYOUT_RATE_DEFAULT = 800; // Use default rate for audit purposes if rate is missing

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

        // 1. Fetch ALL tutors and ALL completed bookings in parallel
        const [tutorsSnapshot, bookingsSnapshot] = await Promise.all([
            adminDb.collection("users").where("role", "==", "tutor").get(),
            adminDb.collection("bookings").where("status", "==", "completed").get(),
        ]);

        const allTutors = tutorsSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
        const allBookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const normalizedTutors = normalizeArray(allTutors, 'uid');

        // 2. Aggregate Earnings per Tutor
        const earningsMap: Record<string, { lessons: number; payout: number; name: string; email: string }> = {};

        allBookings.forEach((booking: any) => {
            const tutorId = booking.tutorId;
            // Use the payout rate locked into the booking record itself (or fallback)
            const payoutRate = booking.tutorPayoutRate || PAYOUT_RATE_DEFAULT;

            // Initialize tutor data if not present
            if (!earningsMap[tutorId]) {
                const tutorProfile: any = normalizedTutors[tutorId] || {};
                earningsMap[tutorId] = {
                    lessons: 0,
                    payout: 0,
                    name: tutorProfile.name || 'Unknown Tutor',
                    email: tutorProfile.email || 'N/A',
                };
            }

            earningsMap[tutorId].lessons += 1;
            earningsMap[tutorId].payout += payoutRate;
        });

        // 3. Format Final List
        const adminEarningsReport = Object.keys(earningsMap).map(uid => ({
            uid,
            ...earningsMap[uid],
            payout: Math.round(earningsMap[uid].payout),
        }));

        return res.status(200).json(adminEarningsReport);

    } catch (error: any) {
        console.error("Admin Earnings API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}