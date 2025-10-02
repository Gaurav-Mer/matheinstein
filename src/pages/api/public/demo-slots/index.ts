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

// The helper function now assumes it receives dates already in the correct timezone
// Improved version with better slotDuration handling and validation
const generateAndFilterSlots = (
    startDateInTutorZone: dayjs.Dayjs,
    endDateInTutorZone: dayjs.Dayjs,
    userData: any,
    bookedSlots: any[]
): any[] => {
    const slotsByDay: Record<string, any[]> = {};
    const tutorTimeZone = userData?.timeZone || 'UTC';
    const availabilityRules = userData?.availability || [];

    // --- Scheduling Rules ---
    const defaultSlotDuration = userData?.sessionDuration?.max ?? 60;
    const bufferTime = userData?.bufferTime ?? 0;
    const minAdvanceNoticeHours = userData?.bookingWindow?.minAdvanceNotice ?? 1;
    const maxAdvanceNoticeDays = userData?.bookingWindow?.maxAdvanceNotice ?? 60;

    // --- Time References for Filtering ---
    const nowInTutorZone = dayjs().tz(tutorTimeZone);
    const earliestBookableTime = nowInTutorZone.add(minAdvanceNoticeHours, 'hour');
    const latestBookableDate = nowInTutorZone.add(maxAdvanceNoticeDays, 'day').endOf('day');

    const bookedSlotStarts = new Set(bookedSlots.map(b => b.startTime));

    let currentDate = startDateInTutorZone.startOf('day');
    const finalEndDate = endDateInTutorZone.endOf('day');

    while (currentDate.isSameOrBefore(finalEndDate, 'day')) {
        if (currentDate.isBefore(nowInTutorZone, 'day') || currentDate.isAfter(latestBookableDate, 'day')) {
            currentDate = currentDate.add(1, 'day');
            continue;
        }

        const dateKey = currentDate.format('YYYY-MM-DD');
        const dayOfWeek = currentDate.format('dddd').toLowerCase();
        const rules = availabilityRules.filter((rule: any) => rule.day === dayOfWeek);
        const daySlots: any[] = [];

        rules.forEach((rule: any) => {
            // Validate time format
            const startTimeParts = rule.startTime.split(':');
            const endTimeParts = rule.endTime.split(':');

            if (startTimeParts.length !== 2 || endTimeParts.length !== 2) {
                console.warn(`Invalid time format for rule: ${rule.day} ${rule.startTime}-${rule.endTime}`);
                return;
            }

            // Use rule-specific slot duration if available, otherwise use default
            const slotDuration = rule.slotDuration || defaultSlotDuration;
            const interval = slotDuration + bufferTime;

            // Combine the current date with the rule's start time
            let currentTime = currentDate
                .hour(parseInt(startTimeParts[0]))
                .minute(parseInt(startTimeParts[1]))
                .second(0)
                .millisecond(0);

            const ruleEndDateTime = currentDate
                .hour(parseInt(endTimeParts[0]))
                .minute(parseInt(endTimeParts[1]))
                .second(0)
                .millisecond(0);

            while (currentTime.isBefore(ruleEndDateTime)) {
                const slotStart = currentTime;
                const slotEnd = currentTime.add(slotDuration, 'minute');

                // Check if slot fits within the rule's time window
                if (slotEnd.isAfter(ruleEndDateTime)) break;

                // Check constraints
                const isTooSoon = slotStart.isBefore(earliestBookableTime);
                const isBooked = bookedSlotStarts.has(slotStart.utc().toISOString());

                if (!isBooked && !isTooSoon) {
                    daySlots.push({
                        startTime: slotStart.utc().toISOString(),
                        endTime: slotEnd.utc().toISOString(),
                        status: 'available',
                        invitees_remaining: 1,
                        duration_minutes: slotDuration, // Include actual duration
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

    // --- Final Transformation Loop ---
    let day = startDateInTutorZone.startOf('day');
    const finalAvailability: any[] = [];

    while (day.isSameOrBefore(finalEndDate, 'day')) {
        const dateKey = day.format('YYYY-MM-DD');
        const slots = slotsByDay[dateKey] || [];

        let dayStatus = 'unavailable';
        if (day.isBefore(nowInTutorZone, 'day')) {
            dayStatus = 'past';
        } else if (day.isAfter(latestBookableDate, 'day')) {
            dayStatus = 'unavailable';
        } else if (slots.length > 0) {
            dayStatus = 'available';
        } else if (availabilityRules.some((rule: any) => day.format('dddd').toLowerCase() === rule.day)) {
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

        const userDoc = await adminDb.collection("users").doc(userId).get();
        const userData = userDoc.data();
        if (!userDoc.exists || !['admin', 'tutor'].includes(userData?.role)) {
            return res.status(403).json({ error: "Forbidden: User is not a designated scheduler." });
        }

        // ✅ Use tutor’s timezone directly when parsing plain dates
        const tutorTimeZone = userData?.timeZone || 'Asia/Kolkata';
        const startDateInTutorZone = dayjs.tz(startDate, "YYYY-MM-DD", tutorTimeZone).startOf("day");
        const endDateInTutorZone = dayjs.tz(endDate, "YYYY-MM-DD", tutorTimeZone).endOf("day");

        // Fetch bookings
        const bookingsSnapshot = await adminDb
            .collection("bookings")
            .where("tutorId", "==", userId)
            .where("startTime", ">=", startDateInTutorZone.subtract(1, 'day').toDate())
            .where("startTime", "<=", endDateInTutorZone.add(1, 'day').toDate())
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

        // Generate slots
        const availableSlots = generateAndFilterSlots(
            startDateInTutorZone,
            endDateInTutorZone,
            userData,
            bookedSlots
        );

        return res.status(200).json({
            availability: availableSlots,
            meta: {
                timezone: tutorTimeZone,
                duration_minutes: userData?.sessionDuration?.max ?? 60,
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
