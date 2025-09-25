/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/admin/purchases.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { normalizeArray } from "@/lib/utils"; // Assuming this utility is available

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        // 1. Verify Admin Token
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decodedToken = await adminAuth.verifyIdToken(token);
        const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get();
        if (userDoc.data()?.role !== "admin") return res.status(403).json({ error: "Forbidden" });

        // 2. Fetch all purchase records
        const purchasesSnapshot = await adminDb
            .collection("purchases")
            .orderBy("purchaseDate", "desc")
            .get();

        const purchases = purchasesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore Timestamp to ISO string for safe transport
            purchaseDate: (doc.data().purchaseDate as any)?.toDate().toISOString()
        }));

        // 3. Collect all user UIDs (Tutors and Students)
        const userUids = new Set<string>();
        purchases.forEach((p: any) => {
            userUids.add(p.studentId);
            userUids.add(p.tutorId);
        });

        // 4. Fetch all relevant user data in parallel
        let usersData: any[] = [];
        if (userUids.size > 0) {
            const usersSnapshot = await adminDb.collection("users").where(
                "uid", "in", Array.from(userUids)
            ).get();
            usersData = usersSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
        }

        const normalizedUsers = normalizeArray(usersData, "uid");

        // 5. Enrich purchases with user data
        const enrichedPurchases = purchases.map((purchase: any) => ({
            ...purchase,
            studentName: normalizedUsers[purchase.studentId]?.name || 'N/A',
            tutorName: normalizedUsers[purchase.tutorId]?.name || 'N/A',
        }));

        return res.status(200).json(enrichedPurchases);

    } catch (error: any) {
        console.error("Admin Purchases API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}