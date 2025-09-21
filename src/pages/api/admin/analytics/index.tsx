/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/admin/analytics.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { startOfMonth, format, subMonths } from 'date-fns';

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

        // Fetch student status counts
        const studentStatusSnapshot = await adminDb.collection("users").where("role", "==", "student").get();
        const studentStatus = studentStatusSnapshot.docs.reduce((acc, doc) => {
            const status = doc.data().status || 'onboarding';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Fetch monthly booking counts for the last 6 months
        const monthlyBookings = await Promise.all(
            Array.from({ length: 6 }).map(async (_, index) => {
                const monthStart = startOfMonth(subMonths(new Date(), index));
                const monthEnd = startOfMonth(subMonths(new Date(), index - 1));

                const bookingsSnapshot = await adminDb
                    .collection('bookings')
                    .where('startTime', '>=', monthStart)
                    .where('startTime', '<', monthEnd)
                    .get();

                return {
                    name: format(monthStart, 'MMM'),
                    bookings: bookingsSnapshot.size,
                };
            })
        );

        // Reverse the array to show the most recent month last
        const reversedMonthlyBookings = monthlyBookings.reverse();

        const analyticsData = {
            monthlyBookings: reversedMonthlyBookings,
            studentStatus: [
                { name: 'Active', value: studentStatus.active || 0, color: 'hsl(var(--primary))' },
                { name: 'Inactive', value: studentStatus.inactive || 0, color: 'hsl(var(--secondary))' },
                { name: 'Onboarding', value: studentStatus.onboarding || 0, color: '#f59e0b' },
            ]
        };

        return res.status(200).json(analyticsData);

    } catch (error: any) {
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}