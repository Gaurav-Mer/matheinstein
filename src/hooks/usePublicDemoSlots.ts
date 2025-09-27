/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// 🚨 UPDATED: Reflects the backend's required ISO date parameters
interface DemoSlotsQuery {
    userId: string;
    startDate: string; // YYYY-MM-DD format
    endDate: string;   // YYYY-MM-DD format
}

/**
 * Fetches the availability profile and booked slots for a designated scheduler (admin/tutor)
 * within a specific date range.
 */
export const usePublicDemoSlots = (query: DemoSlotsQuery) => {
    // 1. 🚨 FIX: Include the specific query parameters in the queryKey
    return useQuery<any, Error>({
        queryKey: ["public-demo-slots", query.endDate, query.endDate],
        queryFn: async () => {
            // Pass the entire query object as URL search parameters
            const { data } = await axios.get("/api/public/demo-slots", { params: query });
            return data;
        },
        // 2. Enable Query: Only run the query if all required parameters are valid
        enabled: !!query.userId && !!query.startDate && !!query.endDate,
        refetchOnMount: false,
        // Set a short stale time since availability is real-time
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};