/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

// Define the query parameters for type safety
interface BookingsQuery {
    page?: number;
    limit?: number;
    userId?: string;
    status?: "upcoming" | "completed" | "cancelled";
}

export const useAdminBookings = (query?: BookingsQuery) => {
    return useQuery({
        queryKey: ["admin-bookings", query],
        queryFn: async () => {
            const { data } = await api.get("/admin/bookings", { params: query });
            return data;
        },
    });
};