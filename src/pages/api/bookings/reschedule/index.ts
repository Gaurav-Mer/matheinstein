/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/bookings/reschedule.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { z } from "zod";
import dayjs from 'dayjs';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

// --- Initialization ---
const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

// Define the required input for the reschedule action
const rescheduleSchema = z.object({
    bookingId: z.string().min(1),
    newStartTime: z.string().datetime(),
    newEndTime: z.string().datetime(),
    // Include the timezone for accurate calendar updates if needed, though UTC is preferred
    timeZone: z.string().optional(),
});

// 1. External Calendar Update Logic
const updateExternalEvent = async (tutorId: string, oldBookingData: any, newBookingData: any) => {
    const eventId = oldBookingData.calendarEventId;
    if (!eventId) return; // Exit if no external event ID was stored

    try {
        const integrationDoc = await adminDb
            .collection("users").doc(tutorId).collection("integrations").doc("googleCalendar").get();
        const tokens = integrationDoc.data()?.tokens;
        if (!tokens) return;

        // Set credentials and prepare client
        oAuth2Client.setCredentials(tokens);
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

        // Patch the existing event with the new start/end times
        await calendar.events.patch({
            calendarId: 'primary',
            eventId: eventId,
            requestBody: {
                start: { dateTime: newBookingData.startTime.toISOString() },
                end: { dateTime: newBookingData.endTime.toISOString() },
                summary: oldBookingData.subject, // Keep the same subject/summary
            },
            sendUpdates: 'all', // Send notification to the student about the update
        });
        console.log(`Google Calendar event ${eventId} patched successfully.`);

    } catch (error) {
        console.error('Error updating external calendar event:', error);
        // CRITICAL: Log the error, but do not fail the main API response
    }
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    // Prepare data for return/external calls
    let oldBookingData: any;
    let newBookingData: any;

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decodedToken = await adminAuth.verifyIdToken(token);
        const { uid: userId } = decodedToken;

        const { bookingId, newStartTime, newEndTime } = rescheduleSchema.parse(req.body);
        const userDocRef = adminDb.collection("users").doc(userId);

        await adminDb.runTransaction(async (t) => {
            const oldBookingRef = adminDb.collection("bookings").doc(bookingId);
            const oldBookingSnap = await t.get(oldBookingRef);
            if (!oldBookingSnap.exists) throw new Error("Original booking not found.");
            oldBookingData = oldBookingSnap.data() as any; // Store for external call

            const userDoc = await t.get(userDocRef); // Fetch inside transaction for security check

            // Security Check: User must be the student or an admin
            if (oldBookingData.studentId !== userId && userDoc.data()?.role !== 'admin') {
                throw new Error("Forbidden: Not authorized to reschedule this booking.");
            }

            // Conflict Check: Check if the new slot is available
            const newStartTimeDate = dayjs(newStartTime).toDate();
            const slotConflict = await adminDb.collection("bookings")
                .where("tutorId", "==", oldBookingData.tutorId)
                .where("startTime", "==", newStartTimeDate)
                .where("status", "==", "upcoming")
                .get();

            if (!slotConflict.empty) throw new Error("The selected new slot is already booked.");

            // 1. Mark Old Booking as Rescheduled
            t.update(oldBookingRef, {
                status: "rescheduled",
                rescheduleDate: new Date(),
            });

            // 2. Create NEW Booking Record (Credits remain unchanged)
            const newBookingRef = adminDb.collection("bookings").doc();
            newBookingData = { // Prepare the new data object
                ...oldBookingData,
                id: newBookingRef.id,
                startTime: newStartTimeDate,
                endTime: dayjs(newEndTime).toDate(),
                status: "upcoming",
                previousBookingId: bookingId,
                calendarEventId: oldBookingData.calendarEventId, // ⚠️ Pass the original Event ID to the new record
                createdAt: new Date(),
            };

            t.set(newBookingRef, newBookingData);

            // 3. Update the old record's link to the new record
            t.update(oldBookingRef, { rescheduledToId: newBookingRef.id });

        });
        // 4. Update External Calendar Event (Call outside transaction)
        if (oldBookingData.calendarEventId) {
            await updateExternalEvent(oldBookingData.tutorId, oldBookingData, newBookingData);
        }

        res.status(200).json({ message: "Lesson rescheduled successfully." });
    } catch (error: any) {
        if (error.message.includes("ZodError")) return res.status(400).json({ error: "Invalid data provided." });
        res.status(500).json({ error: error.message || "Failed to process reschedule." });
    }
}