/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

// Define the query parameters for type safety
interface BookingsQuery {
    page?: number;
    limit?: number;
    status?: "upcoming" | "completed" | "cancelled";
}

export const useTutorBookings = (query?: BookingsQuery) => {
    return useQuery({
        queryKey: ["tutor-bookings", query],
        queryFn: async () => {
            const { data } = await api.get("/tutor/bookings", { params: query });
            return data;
        },
    });
};