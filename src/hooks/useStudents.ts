/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { toast } from "react-toastify";


export const useStudents = () => {
    return useQuery({
        queryKey: ["students"],
        queryFn: async () => {
            const { data } = await api.get("/admin/students");
            return data;
        },
        refetchOnMount: false,
    });
};

export const useStudent = (id: string) => {
    return useQuery({
        queryKey: ["student", id],
        queryFn: async () => {
            const { data } = await api.get(`/admin/students/${id}`);
            return data;
        },
    });
};

export const useAddStudent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        // The mutation function now calls a new, dedicated invite endpoint
        mutationFn: async (newStudent: any) => {
            const { data } = await api.post("/admin/students/invite", newStudent);
            return data;
        },
        onSuccess: (data) => {
            // Invalidate the 'students' query to refetch the list
            queryClient.invalidateQueries({ queryKey: ["students"] });
            toast.success("Student invitation sent successfully!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to send invitation.");
        },
    });
};


export const useUpdateStudent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ uid, ...data }: any) => {
            const { data: updatedFields } = await api.patch(`/admin/students/${uid}`, data);
            // Merge uid with updated fields to correctly update the cache
            return { ...updatedFields, data, uid };
        },
        onSuccess: (updatedStudent) => {
            queryClient.setQueryData(["students"], (old: any[] = []) =>
                old.map(s => (s.uid === updatedStudent.uid ? { ...s, ...updatedStudent?.data } : s))
            );
        },
    });
};

export const useDeleteStudent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (uid: string) => {
            await api.delete(`/admin/students/${uid}`);
            return uid;
        },
        onSuccess: (uid) => {
            queryClient.setQueryData(["students"], (old: any[] = []) =>
                old.filter(s => s.uid !== uid)
            );
        },
    });
};

// This hook fetches students assigned to a specific tutor
export const useTutorStudents = (tutorId: string) => {
    return useQuery({
        queryKey: ["tutor-students", tutorId],
        queryFn: async () => {
            const { data } = await api.get(`/admin/tutors/${tutorId}/students`);
            return data;
        },
        // Only run the query if a tutorId is provided
        enabled: !!tutorId,
    });
};
