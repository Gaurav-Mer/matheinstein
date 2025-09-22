/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { toast } from "react-toastify";
import { z } from "zod";
import { addStudentSchema } from "@/lib/schemas/studentSchema";

// Define a schema for the update mutation that omits password
const updateStudentProfileSchema = addStudentSchema.partial().omit({ password: true });

type UpdateStudentProfileInput = z.infer<typeof updateStudentProfileSchema>;

// This hook fetches the student's own profile
export const useStudentProfile = () => {
    return useQuery({
        queryKey: ["student-profile"],
        queryFn: async () => {
            const { data } = await api.get("/student/profile");
            return data;
        },
    });
};

// This hook handles updating the student's own profile (safely)
export const useUpdateStudentProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: UpdateStudentProfileInput) => {
            const { data: response } = await api.patch("/student/profile", data);
            return response;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["student-profile"], (oldData: any) => ({
                ...oldData,
                ...data,
            }));
            toast.success("Profile updated successfully!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to update profile.");
        },
    });
};