/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

// This hook fetches a single tutor's public profile data for the student-facing side
export const usePublicTutor = (id: string) => {
    return useQuery({
        queryKey: ["public-tutor", id],
        queryFn: async () => {
            const { data } = await api.get(`/tutor/${id}`);
            return data;
        },
        // Only run the query if a valid ID is provided
        enabled: !!id,
    });
};