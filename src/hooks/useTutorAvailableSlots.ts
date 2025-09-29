/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface SlotsQuery {
    tutorId: string; // The tutorId
    startDate: string;
    endDate: string;
}

/**
 * Fetches the complete availability profile and available slots for a given tutor
 * by merging calendar rules and filtering out conflicts (internal/external bookings).
 */
export const useTutorAvailableSlots = (query: SlotsQuery) => {
    console.log("query", query)
    return useQuery<any, Error>({
        // The key is defined by the user ID and the date range
        queryKey: ["tutor-available-slots", query.tutorId, query.startDate, query.endDate],
        queryFn: async () => {
            // 🚨 Reusing the core availability API endpoint
            const { data } = await axios.get("/api/bookings/availability", {
                params: {
                    tutorId: query.tutorId, // The API expects tutorId
                    startDate: query.startDate,
                    endDate: query.endDate
                }
            });
            // The API returns { profile, bookedSlots }—the frontend calculates availability.
            return data;
        },
        enabled: !!query.tutorId && !!query.startDate && !!query.endDate,
        refetchOnMount: false
    });
};