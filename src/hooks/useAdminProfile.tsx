

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { toast } from "react-toastify";
import { z } from "zod";

// Define the schema for the update mutation
const updateAdminProfileSchema = z.object({
    uid: z.string(),
    name: z.string().nullish(),
    email: z.string().email().nullish(),
    password: z.string().min(6).nullish(),
});

type UpdateAdminProfileInput = z.infer<typeof updateAdminProfileSchema>;

// This hook fetches the admin's profile
export const useAdminProfile = () => {
    return useQuery({
        queryKey: ["admin-profile"],
        queryFn: async () => {
            const { data } = await api.get("/admin/profile");
            return data;
        },
    });
};

// This new hook handles updating the admin's profile
export const useUpdateAdminProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: UpdateAdminProfileInput) => {
            const { uid, ...updateData } = data;
            const { data: response } = await api.patch("/admin/profile", updateData);
            return response;
        },
        onSuccess: (data, variables) => {
            // Invalidate the profile query to trigger a fresh data fetch
            queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
            toast.success("Profile updated successfully!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to update profile.");
        },
    });
};