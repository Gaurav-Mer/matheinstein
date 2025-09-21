/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { toast } from "react-toastify";

export const useAdmins = () => {
    return useQuery({
        queryKey: ["admins"],
        queryFn: async () => {
            const { data } = await api.get("/admin/admins");
            return data;
        },
    });
};

export const useDeleteAdmin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (uid: string) => {
            const { data } = await api.delete("/admin/admins", { data: { uid } });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admins"] });
            toast.success("Admin deleted successfully.");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to delete admin.");
        },
    });
};