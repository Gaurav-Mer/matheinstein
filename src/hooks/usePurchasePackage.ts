/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { PaidLessonPackage } from "@/lib/schemas/paidLessonSchema";
import api from "@/lib/axios";

// Define the full input required for the purchase API call
interface PurchaseInput {
    tutorId: string;
    packageData: PaidLessonPackage;
}

export const usePurchasePackage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: PurchaseInput) => {
            // This POST request hits the API that simulates payment, creates the record, and adds credits.
            const { data: response } = await api.post("/student/purchase-package", data);
            return response;
        },
        onSuccess: (response) => {
            // 🚨 CRUCIAL: Invalidate the user's profile and dashboard data to show the new credit balance instantly.
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            queryClient.invalidateQueries({ queryKey: ["student-dashboard"] });

            toast.success(response.message || "Package purchased successfully! Credits added.");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to process package purchase.");
        },
    });
};