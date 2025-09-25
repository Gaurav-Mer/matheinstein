/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/bookings/availability.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/lib/firebaseAdmin";
import { z } from "zod";
import { startOfMonth, endOfMonth, parseISO } from "date-fns";
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

const querySchema = z.object({
    tutorId: z.string().min(1, "Tutor ID is required."),
    month: z.string().min(1, "Month is required (YYYY-MM-DD format)."),
});

// Initialize OAuth2 Client using environment variables
const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

const fetchExternalEvents = async (tutorId: string, timeMin: string, timeMax: string): Promise<any[]> => {
    try {
        // 1. Fetch the tutor's stored tokens
        // Assuming tokens are stored in a 'integrations' subcollection or directly on the user doc
        const integrationDoc = await adminDb
            .collection("users")
            .doc(tutorId)
            .collection("integrations")
            .doc("googleCalendar")
            .get();

        const tokens = integrationDoc.data()?.tokens;

        if (!tokens) return []; // No integration, no external events

        // 2. Set credentials and initialize Calendar client
        oAuth2Client.setCredentials(tokens);
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

        // 3. Fetch calendar events
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin,
            timeMax,
            maxResults: 200, // Limit events to prevent overload
            singleEvents: true,
            orderBy: 'startTime',
        });

        // 4. Normalize the external events to match our internal booking structure
        return response.data.items
            ?.filter(event => event.start?.dateTime && event.end?.dateTime) // Filter out all-day or unscheduled events
            .map(event => ({
                id: event.id,
                startTime: event?.start?.dateTime,
                endTime: event.end?.dateTime,
                // We mark external events with a type for differentiation
                type: 'external_busy',
            })) || [];

    } catch (error) {
        console.error(`Error fetching external calendar for tutor ${tutorId}:`, error);
        // Fail silently on external error to not crash the booking, but don't return external slots
        return [];
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const validatedData = querySchema.parse(req.query);
        const { tutorId, month } = validatedData;

        const startOfMonthDate = startOfMonth(parseISO(month));
        const endOfMonthDate = endOfMonth(parseISO(month));

        // 1. Fetch internal bookings from Firestore
        const bookingsSnapshot = await adminDb
            .collection("bookings")
            .where("tutorId", "==", tutorId)
            .where("startTime", ">=", startOfMonthDate)
            .where("startTime", "<=", endOfMonthDate)
            .where("status", "==", "upcoming") // Only filter out confirmed upcoming bookings
            .get();

        const internalBookings = bookingsSnapshot.docs.map(doc => ({
            id: doc.id,
            startTime: (doc.data().startTime as any)?.toDate().toISOString(),
            endTime: (doc.data().endTime as any)?.toDate().toISOString(),
            type: 'internal_booking',
        }));

        // 2. Fetch external events from Google Calendar
        const externalBookings = await fetchExternalEvents(
            tutorId,
            startOfMonthDate.toISOString(),
            endOfMonthDate.toISOString()
        );

        // 3. Combine both lists
        const bookedSlots = [...internalBookings, ...externalBookings];

        return res.status(200).json(bookedSlots);

    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({ error: "Invalid data provided", details: error.issues });
        }
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}