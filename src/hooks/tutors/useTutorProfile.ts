/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AddTutorInput } from "@/lib/schemas/tutorSchema";
import api from "@/lib/axios";

// This hook fetches the tutor's own profile
export const useTutorProfile = () => {
    return useQuery({
        queryKey: ["tutor-profile"],
        queryFn: async () => {
            const { data } = await api.get("/tutor/profile");
            return data;
        },
    });
};

// This hook handles updating the tutor's own profile
export const useUpdateTutorProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: AddTutorInput) => {
            const { data: response } = await api.patch("/tutor/profile", data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tutor-profile"] });
            toast.success("Profile updated successfully!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to update profile.");
        },
    });
};