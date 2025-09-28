/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/bookings/status.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { z } from "zod";

const statusUpdateSchema = z.object({
    bookingId: z.string().min(1, "Booking ID is required."),
    // Define the valid statuses the tutor can set
    newStatus: z.enum(["completed", "no_show"]),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PATCH") {
        res.setHeader("Allow", ["PATCH"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decodedToken = await adminAuth.verifyIdToken(token);
        const { uid: userId } = decodedToken;

        const { bookingId, newStatus } = statusUpdateSchema.parse(req.body);

        const bookingRef = adminDb.collection("bookings").doc(bookingId);
        const bookingSnap = await bookingRef.get();
        const bookingData = bookingSnap.data() as any;

        if (!bookingSnap.exists) throw new Error("Booking not found.");

        // Fetch the user document to check the role
        const userDoc = await adminDb.collection("users").doc(userId).get();

        // Security Check: Only the assigned tutor or an admin can mark completion
        if (bookingData.tutorId !== userId && userDoc.data()?.role !== 'admin') {
            throw new Error("Forbidden: Not authorized to update this booking.");
        }

        // Logic to prevent marking a session complete/no-show before it even happens (Optional)
        // if (bookingData.startTime.toDate() > new Date() && newStatus !== 'no_show') {
        //      return res.status(400).json({ error: "Cannot mark a future session as completed." });
        // }

        // Finalize the update
        const updatePayload: any = {
            status: newStatus,
            updatedAt: new Date(),
        };

        if (newStatus === 'completed') {
            updatePayload.completionDate = new Date();
        } else if (newStatus === 'no_show') {
            updatePayload.noShowDate = new Date();
            // ⚠️ Future Logic: If 'no_show', trigger a separate API to handle tutor compensation (no refund to student).
        }

        await bookingRef.update(updatePayload);

        return res.status(200).json({ message: `Lesson marked as ${newStatus.replace('_', ' ')}.` });
    } catch (error: any) {
        if (error.name === "ZodError") return res.status(400).json({ error: "Invalid data provided." });
        console.error("Booking Status API error:", error);
        return res.status(500).json({ error: error.message || "Failed to update booking status." });
    }
}