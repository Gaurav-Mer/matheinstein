/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { toast } from "react-toastify";

// --- Cancellation Mutation ---
export const useCancelBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (bookingId: string) => {
            // PATCH request to the cancellation API
            const { data } = await api.patch("/bookings/cancel", { bookingId });
            return data;
        },
        onSuccess: (data) => {
            // 💡 CRITICAL: Invalidate student's profile to update credit balance
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            queryClient.invalidateQueries({ queryKey: ["student-bookings"] });
            queryClient.invalidateQueries({ queryKey: ["tutor-bookings"] });
            toast.success(data.message || "Lesson cancelled successfully!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to cancel lesson.");
        },
    });
};

// --- Reschedule Mutation ---
export const useRescheduleBooking = () => {
    const queryClient = useQueryClient();

    interface RescheduleData {
        bookingId: string;
        newStartTime: string;
        newEndTime: string;
    }

    return useMutation({
        mutationFn: async (data: RescheduleData) => {
            // POST request to the rescheduling API
            const { data: response } = await api.post("/bookings/reschedule", data);
            return response;
        },
        onSuccess: () => {
            // Invalidate bookings lists to show the new/old booking status
            queryClient.invalidateQueries({ queryKey: ["student-bookings"] });
            queryClient.invalidateQueries({ queryKey: ["tutor-bookings"] });
            toast.success("Lesson rescheduled successfully!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to reschedule lesson.");
        },
    });
};