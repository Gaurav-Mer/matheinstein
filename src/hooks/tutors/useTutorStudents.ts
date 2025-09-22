/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

// Define the query parameters for type safety
interface StudentsQuery {
    page?: number;
    limit?: number;
    status?: "active" | "inactive" | "onboarding";
}

export const useTutorStudents = (query?: StudentsQuery) => {
    return useQuery({
        queryKey: ["tutor-students", query],
        queryFn: async () => {
            const { data } = await api.get("/tutor/students", { params: query });
            return data;
        },
    });
};