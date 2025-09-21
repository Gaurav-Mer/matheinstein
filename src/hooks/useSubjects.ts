/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";

export const useSubjects = () => {
    return useQuery({
        queryKey: ["subjects"],
        queryFn: async () => {
            const { data } = await api.get("/admin/subjects");
            return data;
        }
    })
};

export const useAddSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (body: { name: string, status: string, }) => {
            const { data } = await api.post(
                "/admin/subjects",
                body);
            return data;
        },
        onSuccess: (data) => queryClient.setQueryData(["subjects"], (old: any[] = []) => [...old, data])
    }
    );
};

export const useUpdateSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, name, status }: { id: string; name: string, status: string }) => {
            const { data } = await api.put(
                `/admin/subjects/${id}`,
                { name, status });
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["subjects"], (old: any[] = []) =>
                old.map((sub) => (sub.id === data.id ? data : sub))
            );
        },
    }
    );
};

export const useDeleteSubject = () => {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: async (id: string) => {
                const { data } = await api.delete(`/admin/subjects/${id}`);
                return data;
            },
            onSuccess: (_, id) => {
                queryClient.setQueryData(["subjects"], (old: any[] = []) =>
                    old.filter((sub) => sub.id !== id)
                );
            },
        },
    );
};
