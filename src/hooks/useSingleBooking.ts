/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export const useSingleBooking = (bookingId: string) => {
    return useQuery({
        queryKey: ["single-booking", bookingId],
        queryFn: async () => {
            const { data } = await api.get(`/bookings/${bookingId}`);
            return data;
        },
        enabled: !!bookingId,
    });
};