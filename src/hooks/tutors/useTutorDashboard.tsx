/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useTutorDashboard = () => {
    return useQuery({
        queryKey: ["tutor-dashboard"],
        queryFn: async () => {
            const { data } = await api.get("/tutor/dashboard");
            return data;
        },
    });
};