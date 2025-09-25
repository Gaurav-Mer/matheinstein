/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/bookings/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { id: bookingId } = req.query;
        if (!bookingId || typeof bookingId !== "string") {
            return res.status(400).json({ error: "Booking ID is required." });
        }

        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decodedToken = await adminAuth.verifyIdToken(token);
        const { uid: userId } = decodedToken;

        const bookingDoc = await adminDb.collection("bookings").doc(bookingId).get();
        if (!bookingDoc.exists) {
            return res.status(404).json({ error: "Booking not found." });
        }
        const bookingData = bookingDoc.data();

        // Security Check: User must be the student OR the tutor OR an admin
        const userDoc = await adminDb.collection("users").doc(userId).get();
        if (bookingData?.studentId !== userId && bookingData?.tutorId !== userId && userDoc.data()?.role !== 'admin') {
            return res.status(403).json({ error: "Forbidden: Access denied." });
        }

        // Fetch tutor data for display
        const tutorDoc = await adminDb.collection("users").doc(bookingData?.tutorId).get();
        const tutorData = tutorDoc.data();

        // Return the booking data enriched with the tutor's name/details
        return res.status(200).json({
            ...bookingData,
            tutor: { uid: tutorDoc.id, name: tutorData?.name, timeZone: tutorData?.timeZone },
            id: bookingDoc.id,
        });

    } catch (error: any) {
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}