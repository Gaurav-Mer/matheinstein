/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/bookings/cancel.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { google } from 'googleapis';
import { differenceInHours } from 'date-fns';
import { z } from "zod";
import { OAuth2Client } from "google-auth-library";

// ⚠️ Initialize OAuth2 Client once outside the handler
const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

const cancelSchema = z.object({
    bookingId: z.string().min(1),
});

const deleteExternalEvent = async (tutorId: string, eventId: string) => {
    try {
        const integrationDoc = await adminDb.collection("users").doc(tutorId).collection("integrations").doc("googleCalendar").get();
        const tokens = integrationDoc.data()?.tokens;
        if (!tokens) return;

        oAuth2Client.setCredentials(tokens);
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
        await calendar.events.delete({ calendarId: 'primary', eventId });
    } catch (error) {
        console.error('Error deleting external calendar event:', error);
        // CRITICAL: Log the error, but do not fail the main API call.
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PATCH") {
        res.setHeader("Allow", ["PATCH"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    // Variables to be fetched/determined outside the transaction
    let bookingData: any;
    let shouldRefund = false;
    let tutorId: string;
    let eventId: string | undefined;

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decodedToken = await adminAuth.verifyIdToken(token);
        const { uid: userId } = decodedToken;

        const { bookingId } = cancelSchema.parse(req.body);

        // Fetch user doc (outside transaction) for immediate security check
        const callingUserDoc = await adminDb.collection("users").doc(userId).get();
        const callingUserRole = callingUserDoc.data()?.role;

        // 🚨 START ATOMIC TRANSACTION 🚨
        const transactionResult = await adminDb.runTransaction(async (t) => {
            const bookingRef = adminDb.collection("bookings").doc(bookingId);
            const bookingSnap = await t.get(bookingRef);

            if (!bookingSnap.exists) throw new Error("Booking not found.");
            bookingData = bookingSnap.data() as any; // Store for use outside transaction

            // Security Check: User must be the student OR an admin
            if (bookingData.studentId !== userId && callingUserRole !== 'admin') {
                throw new Error("Forbidden: Not authorized to cancel this booking.");
            }

            // CRITICAL: Check Business Rule (Refund if more than 24 hours away)
            const hoursUntilLesson = differenceInHours(bookingData.startTime.toDate(), new Date());
            shouldRefund = hoursUntilLesson > 24;

            // Get tutorId and calendarEventId for use outside transaction
            tutorId = bookingData.tutorId;
            eventId = bookingData.calendarEventId;

            // 1. Update Student Credits (Atomic Refund)
            if (shouldRefund) {
                const studentRef = adminDb.collection("users").doc(bookingData.studentId);
                const studentSnap = await t.get(studentRef); // Fetch student inside transaction
                const newCredits = (studentSnap.data()?.lessonCredits || 0) + 1;
                t.update(studentRef, { lessonCredits: newCredits });
            }

            // 2. Update Booking Status
            t.update(bookingRef, {
                status: "cancelled",
                cancellationDate: new Date(),
                refunded: shouldRefund,
            });

            return shouldRefund;
        });
        // 🚨 END ATOMIC TRANSACTION 🚨

        // 3. Execute External Action ONLY AFTER TRANSACTION IS COMMITTED
        if (eventId) {
            await deleteExternalEvent(tutorId!, eventId);
        }

        const message = transactionResult ? "Lesson cancelled successfully. 1 credit refunded." : "Lesson cancelled successfully. Refund window closed.";
        res.status(200).json({ message });

    } catch (error: any) {
        if (error.name === "ZodError") return res.status(400).json({ error: "Invalid data provided." });
        res.status(500).json({ error: error.message || "Failed to process cancellation." });
    }
}