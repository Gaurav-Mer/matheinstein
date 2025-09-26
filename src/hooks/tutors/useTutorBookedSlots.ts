/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Interface for the data returned by the API
interface BookedSlot {
    id: string;
    startTime: string;
    endTime: string;
    type?: 'internal_booking' | 'external_busy';
}

/**
 * Fetches all occupied time slots for a specific tutor within a given month.
 * * @param tutorId The UID of the tutor.
 * @param month The month to check (ISO string, e.g., '2025-10-01T00:00:00.000Z').
 */
export const useTutorBookedSlots = (tutorId: string, month: string) => {
    return useQuery<BookedSlot[], Error>({
        queryKey: ["tutor-booked-slots", tutorId, month],
        queryFn: async () => {
            const { data } = await axios.get("/api/bookings/availability", {
                params: { tutorId, month },
            });
            return data;
        },
        // Only run the query if both tutorId and month are available
        enabled: !!tutorId && !!month,
        // Data is dynamic, so staleTime should be short
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnMount: false
    });
};