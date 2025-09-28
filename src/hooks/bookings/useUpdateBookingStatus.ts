/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface StatusUpdateData {
    bookingId: string;
    newStatus: "completed" | "no_show";
}

export const useUpdateBookingStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: StatusUpdateData) => {
            const { data: response } = await api.patch("/bookings/status", data);
            return response;
        },
        onSuccess: (data) => {
            // Invalidate the tutor's booking list to reflect the status change instantly
            queryClient.invalidateQueries({ queryKey: ["tutor-bookings"] });
            // Invalidate the admin's general bookings list as well
            queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
            toast.success(data.message);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to update status.");
        },
    });
};