/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { toast } from "react-toastify";

export const useAdminDemoRequests = () => {
    return useQuery({
        queryKey: ["admin-demo-requests"],
        queryFn: async () => {
            const { data } = await api.get("/admin/demo-requests");
            return data;
        },
    });
};

export const useAssignDemo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ requestId, tutorId }: { requestId: string; tutorId: string }) => {
            const { data } = await api.patch(`/admin/demo-requests/${requestId}`, { tutorId });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-demo-requests"] });
            queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
            toast.success("Tutor assigned successfully!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to assign tutor.");
        },
    });
};