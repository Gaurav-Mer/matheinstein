/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/public/demo-slots.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/lib/firebaseAdmin";
import { z } from "zod";
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
    userId: z.string().min(1, "User ID is required."),
    startDate: z.string().min(1, "Start Date is required (ISO format)."),
    endDate: z.string().min(1, "End Date is required (ISO format)."),
});

// Helper function to generate time slots and filter conflicts
const generateAndFilterSlots = (
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs,
    userData: any,
    bookedSlots: any[]
): any[] => {
    const slotsByDay: Record<string, any[]> = {};
    const availableSlots: any[] = [];
    const tutorTimeZone = userData?.timeZone || 'UTC';
    const availabilityRules = userData?.availability || [];

    // CRITICAL: Fetch duration and buffer from user profile with defaults
    const slotDuration = userData?.sessionDuration?.max ?? 60;
    const bufferTime = userData?.bufferTime ?? 15;
    const interval = slotDuration + bufferTime;

    // Convert booked slots array to a Set for O(1) conflict check
    const bookedSlotStarts = new Set(bookedSlots.map(b => b.startTime));

    let currentDate = startDate.startOf('day');
    const finalEndDate = endDate.endOf('day');
    const nowUtc = dayjs.utc(); // Reference point for checking past time

    // 1. Iterate through each day in the requested range
    while (currentDate.isSameOrBefore(finalEndDate, 'day')) {
        const dateKey = currentDate.format('YYYY-MM-DD');
        const dayOfWeek = currentDate.format('dddd').toLowerCase();
        const rules = availabilityRules.filter((rule: any) => rule.day === dayOfWeek);
        const daySlots: any = [];

        // Skip processing past days
        if (currentDate.isBefore(nowUtc, 'day')) {
            currentDate = currentDate.add(1, 'day');
            continue;
        }

        rules.forEach((rule: any) => {
            // Set the start time in the tutor's time zone for accurate conversion
            let currentTime = dayjs(dateKey).hour(parseInt(rule.startTime.split(':')[0], 10)).minute(parseInt(rule.startTime.split(':')[1], 10)).tz(tutorTimeZone, true);
            const ruleEndDateTime = dayjs(dateKey).hour(parseInt(rule.endTime.split(':')[0], 10)).minute(parseInt(rule.endTime.split(':')[1], 10)).tz(tutorTimeZone, true);

            // 2. Generate potential slots for that day
            while (currentTime.isBefore(ruleEndDateTime)) {
                const slotStartUtc = currentTime.utc();
                const slotStartIso = slotStartUtc.toISOString();

                // Check conflict and past time using correct Day.js methods
                const isBooked = bookedSlotStarts.has(slotStartIso);
                const isPast = slotStartUtc.isBefore(nowUtc); // ⬅️ FIX: Use isBefore(dayjs.utc())

                if (!isBooked && !isPast) {
                    daySlots.push({
                        start_time: slotStartIso,
                        end_time: slotStartUtc.add(slotDuration, 'minute').toISOString(),
                        status: 'available',
                        invitees_remaining: 1,
                    });
                }

                // Move to the next slot by adding the full interval (Lesson + Buffer)
                currentTime = currentTime.add(interval, 'minute');
            }
        });

        if (daySlots.length > 0) {
            slotsByDay[dateKey] = daySlots;
        }

        currentDate = currentDate.add(1, 'day');
    }

    // 3. Transform into the final array structure (Calendly Style)
    let day = startDate.startOf('day');
    const finalAvailability: any[] = [];

    while (day.isSameOrBefore(finalEndDate, 'day')) {
        const dateKey = day.format('YYYY-MM-DD');
        const slots = slotsByDay[dateKey] || [];

        let dayStatus = 'unavailable';
        if (slots.length > 0) {
            dayStatus = 'available';
        } else if (day.isBefore(dayjs().startOf('day'))) {
            dayStatus = 'past';
        } else if (userData?.availability?.some((rule: any) => day.format('dddd').toLowerCase() === rule.day)) {
            // If the day has rules but no available slots (meaning fully booked or too close to now)
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
        const { userId, startDate, endDate } = validatedData;

        // 1. Fetch User Data and Validate Role
        const userDoc = await adminDb.collection("users").doc(userId).get();
        const userData = userDoc.data();

        if (!userDoc.exists || !['admin', 'tutor'].includes(userData?.role)) {
            return res.status(403).json({ error: "Forbidden: User is not a designated scheduler." });
        }

        // 2. Define Range and Fetch Bookings
        const startDateObj = dayjs(startDate).toDate();
        const endDateObj = dayjs(endDate).toDate();

        const bookingsSnapshot = await adminDb
            .collection("bookings")
            .where("tutorId", "==", userId)
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
            }
        });

        // 3. Generate and Filter Available Slots on the Backend
        const availableSlots = generateAndFilterSlots(
            dayjs(startDate),
            dayjs(endDate),
            userData,
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
            return res.status(400).json({ error: "Invalid parameters provided." });
        }
        console.error("Public Demo Slots API error:", error);
        return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}