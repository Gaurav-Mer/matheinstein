/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/student/purchases.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        // 1. Security Check: Authenticate the user and get their ID
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decodedToken = await adminAuth.verifyIdToken(token);
        const { uid: studentId } = decodedToken;

        const studentDoc = await adminDb.collection("users").doc(studentId).get();
        if (studentDoc.data()?.role !== "student") return res.status(403).json({ error: "Forbidden" });

        // 2. Fetch all purchases for this student, ordered by most recent
        const purchasesSnapshot = await adminDb
            .collection("purchases")
            .where("studentId", "==", studentId)
            .orderBy("purchaseDate", "desc")
            .get();

        const purchases = purchasesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore Timestamp to ISO string for safe transport
            purchaseDate: (doc.data().purchaseDate as any)?.toDate().toISOString()
        }));

        return res.status(200).json(purchases);

    } catch (error: any) {
        console.error("Purchases API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}