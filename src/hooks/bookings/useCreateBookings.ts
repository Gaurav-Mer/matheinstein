/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface BookingData {
    tutorId: string;
    studentId: string;
    subject: string;
    startTime: string;
    endTime: string;
}

export const useCreateBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: BookingData) => {
            const { data: response } = await api.post("/bookings", data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tutor-bookings"] }); // Invalidate tutor's bookings
            queryClient.invalidateQueries({ queryKey: ["student-bookings"] }); // Invalidate student's bookings
            toast.success("Booking created successfully!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to create booking.");
        },
    });
};