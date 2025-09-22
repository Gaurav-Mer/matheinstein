/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useTutorBookedSlots = (tutorId: string, month: string) => {
    return useQuery({
        queryKey: ["tutor-booked-slots", tutorId, month],
        queryFn: async () => {
            const { data } = await api.get("/bookings/availability", {
                params: { tutorId, month },
            });
            return data;
        },
        enabled: !!tutorId && !!month,
    });
};