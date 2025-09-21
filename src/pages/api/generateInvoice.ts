/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { tutorId, month } = req.body;

    try {
        const bookings = await adminDb.collection("bookings")
            .where("tutorId", "==", tutorId)
            .where("month", "==", month)
            .get();

        let totalAmount = 0;
        bookings.forEach(doc => totalAmount += doc.data().amount || 0);

        await adminDb.collection("invoices").doc(`${tutorId}_${month}`).set({
            tutorId, month, total: totalAmount, generatedAt: Date.now(),
        });

        res.status(200).json({ message: "Invoice generated" });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}
