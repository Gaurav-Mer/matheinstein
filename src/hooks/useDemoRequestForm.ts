/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

interface DemoRequestData {
    studentName: string;
    studentEmail: string;
    subjectId: string;
    requestedDateTime: string;
    adminId?: string;
}

export const useDemoRequestForm = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: DemoRequestData) => {
            // Calls the public API that handles user creation and pending demo request
            const { data: response } = await axios.post("/api/admin/demo-request", data);
            return response;
        },
        onSuccess: () => {
            // Invalidate admin's dashboard and demo requests list to show the new request immediately
            queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["admin-demo-requests"] });
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.error || "Failed to book demo. Please try again.";
            toast.error(errorMessage);
        },
    });
};