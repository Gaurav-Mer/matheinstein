/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { AddTutorInput } from "@/lib/schemas/tutorSchema";
import { toast } from "react-toastify";

export const useTutors = () => {
    return useQuery({
        queryKey: ["tutors"],
        queryFn: async () => {
            const { data } = await api.get("/admin/tutors");
            return data;
        },
        refetchOnMount: false,
    });
};


export const useTutor = (id: string) => {
    return useQuery({
        queryKey: ["tutor", id],
        queryFn: async () => {
            const { data } = await api.get(`/admin/tutors/${id}`);
            return data;
        },
    });
};


export const useAddTutor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newTutor: AddTutorInput) => {
            // This is the correct endpoint for adding/inviting a new tutor
            const { data } = await api.post("/admin/tutors", newTutor);
            return data;
        },
        onSuccess: (data) => {
            // Safely invalidate the cache to trigger a fresh data fetch
            queryClient.setQueryData(["tutors"], (old: any[] = []) => [...old, data]);
            toast.success("Tutor invitation sent successfully!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to invite tutor.");
        },
    });
};
export const useUpdateTutor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ uid, ...data }: any) => {
            const { data: updatedFields } = await api.patch(`/admin/tutors/${uid}`, data);
            // merge uid with updated fields
            return { ...updatedFields, data, uid, };
        },
        onSuccess: (updatedTutor) => {
            queryClient.setQueryData(["tutors"], (old: any[] = []) =>
                old.map(t => (t.uid === updatedTutor.uid ? { ...t, ...updatedTutor?.data } : t))
            );
        },
    });
};


export const useDeleteTutor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (uid: string) => {
            await api.delete(`/admin/tutors/${uid}`);
            return uid;
        },
        onSuccess: (uid) => {
            queryClient.setQueryData(["tutors"], (old: any[] = []) =>
                old.filter(t => t.uid !== uid)
            );
        },
    });
};
