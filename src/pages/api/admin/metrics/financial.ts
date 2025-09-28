/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/admin/metrics/financial.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

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

        // 1. Fetch ALL Purchases (Source of Gross Revenue)
        const purchasesSnapshot = await adminDb.collection("purchases").get();
        const allPurchases = purchasesSnapshot.docs.map(doc => doc.data());

        // 2. Fetch ALL Completed Bookings (Source of Cost/Payout Trigger)
        const bookingsSnapshot = await adminDb
            .collection("bookings")
            .where("status", "==", "completed")
            .get();
        const completedBookings = bookingsSnapshot.docs.map(doc => doc.data());

        // 3. Aggregate Gross Revenue
        const totalGrossRevenue = allPurchases.reduce((sum, p) => sum + (p.totalAmountINR || 0), 0);

        // 4. Aggregate Total Payout Liability (Cost of Goods Sold - COGS)
        // Sums the locked-in payout rate from every completed lesson
        const totalPayoutLiability = completedBookings.reduce((sum, b) => sum + (b.tutorPayoutRate || 0), 0);

        // 5. Calculate Net Profit (Margin)
        const netPlatformProfit = totalGrossRevenue - totalPayoutLiability;

        // 6. Return Consolidated Metrics
        return res.status(200).json({
            totalGrossRevenue: Math.round(totalGrossRevenue),
            totalPayoutLiability: Math.round(totalPayoutLiability),
            netPlatformProfit: Math.round(netPlatformProfit),
            totalCreditsSold: allPurchases.reduce((sum, p) => sum + (p.creditsPurchased || 0), 0),
        });

    } catch (error: any) {
        console.error("Admin Financial Metrics API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}