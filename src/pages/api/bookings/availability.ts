/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/bookings/availability.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/lib/firebaseAdmin";
import { z } from "zod";
import { parseISO } from "date-fns";
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const querySchema = z.object({
    tutorId: z.string().min(1, "Tutor ID is required."),
    startDate: z.string().min(1, "Start Date is required (ISO format)."),
    endDate: z.string().min(1, "End Date is required (ISO format)."),
});

// Initialize OAuth2 Client using environment variables
const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

// --- 1. External Calendar Fetch Logic (Uses tutorId) ---
const fetchExternalEvents = async (tutorId: string, timeMin: string, timeMax: string): Promise<any[]> => {
    try {
        const integrationDoc = await adminDb
            .collection("users")
            .doc(tutorId)
            .collection("integrations")
            .doc("googleCalendar")
            .get();

        const tokens = integrationDoc.data()?.tokens;
        if (!tokens) return [];

        oAuth2Client.setCredentials(tokens);
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin,
            timeMax,
            maxResults: 200,
            singleEvents: true,
            orderBy: 'startTime',
        });

        return response.data.items
            ?.filter(event => event.start?.dateTime && event.end?.dateTime)
            .map(event => ({
                id: event.id,
                startTime: event.start?.dateTime,
                endTime: event.end?.dateTime,
                type: 'external_busy',
            })) || [];

    } catch (error) {
        console.error(`Error fetching external calendar for tutor ${tutorId}:`, error);
        return [];
    }
};

// --- 2. Slot Generation Logic (Uses userData passed as argument) ---
const generateAndFilterSlots = (
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs,
    // ⬅️ userData is expected to be passed here
    userData: any,
    bookedSlots: any[]
): any[] => {
    const slotsByDay: Record<string, any[]> = {};
    const availableSlots: any[] = [];

    // ⬅️ Access properties safely
    const tutorTimeZone = userData?.timeZone || 'UTC';
    const availabilityRules = userData?.availability || [];

    const slotDuration = userData?.sessionDuration?.max ?? 60;
    const bufferTime = userData?.bufferTime ?? 15;
    const interval = slotDuration + bufferTime;

    const bookedSlotStarts = new Set(bookedSlots.map(b => b.startTime));

    let currentDate = startDate.startOf('day');
    const finalEndDate = endDate.endOf('day');
    const nowUtc = dayjs.utc();

    // The rest of the logic inside this function remains correct, as it relies on the passed userData.

    while (currentDate.isSameOrBefore(finalEndDate, 'day')) {
        const dateKey = currentDate.format('YYYY-MM-DD');
        const dayOfWeek = currentDate.format('dddd').toLowerCase();
        const rules = availabilityRules.filter((rule: any) => rule.day === dayOfWeek);
        const daySlots: any = [];

        if (currentDate.isBefore(nowUtc, 'day')) {
            currentDate = currentDate.add(1, 'day');
            continue;
        }

        rules.forEach((rule: any) => {
            let currentTime = dayjs(dateKey).hour(parseInt(rule.startTime.split(':')[0], 10)).minute(parseInt(rule.startTime.split(':')[1], 10)).tz(tutorTimeZone, true);
            const ruleEndDateTime = dayjs(dateKey).hour(parseInt(rule.endTime.split(':')[0], 10)).minute(parseInt(rule.endTime.split(':')[1], 10)).tz(tutorTimeZone, true);

            while (currentTime.isBefore(ruleEndDateTime)) {
                const slotStartUtc = currentTime.utc();
                const slotStartIso = slotStartUtc.toISOString();

                const isBooked = bookedSlotStarts.has(slotStartIso);
                const isPast = slotStartUtc.isBefore(nowUtc);

                if (!isBooked && !isPast) {
                    daySlots.push({
                        startTime: slotStartIso,
                        endTime: slotStartUtc.add(slotDuration, 'minute').toISOString(),
                        displayTime: currentTime.format('h:mm A'),
                    });
                }

                currentTime = currentTime.add(interval, 'minute');
            }
        });

        if (daySlots.length > 0) {
            slotsByDay[dateKey] = daySlots;
        }

        currentDate = currentDate.add(1, 'day');
    }

    // Transform into the final array structure (Grouped by Day)
    let day = dayjs(startDate).startOf('day');
    const finalAvailability: any[] = [];

    while (day.isSameOrBefore(finalEndDate, 'day')) {
        const dateKey = day.format('YYYY-MM-DD');
        const slots = slotsByDay[dateKey] || [];

        let dayStatus = 'unavailable';
        if (slots.length > 0) {
            dayStatus = 'available';
        } else if (day.isSameOrBefore(dayjs().startOf('day'))) {
            dayStatus = 'past';
        } else if (userData?.availability?.some((rule: any) => day.format('dddd').toLowerCase() === rule.day)) {
            dayStatus = 'booked_solid';
        }

        finalAvailability.push({
            date: dateKey,
            status: dayStatus,
            slots: slots,
        });

        day = day.add(1, 'day');
    }

    return finalAvailability;
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const validatedData = querySchema.parse(req.query);
        const { tutorId, startDate, endDate } = validatedData;

        // 1. Fetch User Data (Profile, Rules)
        const tutorDoc = await adminDb.collection("users").doc(tutorId).get();
        // ⬅️ userData is defined here
        const userData = tutorDoc.data();

        if (!tutorDoc.exists || !['admin', 'tutor'].includes(userData?.role)) {
            return res.status(404).json({ error: "Tutor not found or not a scheduler." });
        }

        // 2. Define Range and Fetch Bookings
        const startDateObj = parseISO(startDate);
        const endDateObj = parseISO(endDate);

        const bookingsSnapshot = await adminDb
            .collection("bookings")
            .where("tutorId", "==", tutorId)
            .where("startTime", ">=", startDateObj)
            .where("startTime", "<=", endDateObj)
            .where("status", "==", "upcoming")
            .get();

        const bookedSlots = bookingsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                startTime: (data.startTime as any)?.toDate().toISOString(),
                endTime: (data.endTime as any)?.toDate().toISOString(),
                type: 'internal_booking',
            }
        });

        // 3. Generate and Filter Available Slots on the Backend
        const availableSlots = generateAndFilterSlots(
            dayjs(startDate),
            dayjs(endDate),
            userData, // ⬅️ userData is correctly passed to the helper
            bookedSlots
        );

        // 4. Return the final, structured response
        return res.status(200).json({
            availability: availableSlots,
            meta: {
                timezone: userData?.timeZone || 'UTC',
                duration_minutes: userData?.sessionDuration?.max ?? 60,
                interval_minutes: userData?.bufferTime ? userData.bufferTime + (userData.sessionDuration?.max ?? 60) : 75,
            }
        });

    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({ error: "Invalid data provided." });
        }
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}