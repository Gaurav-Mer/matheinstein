/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export const useAdminAnalytics = () => {
    return useQuery({
        queryKey: ["admin-analytics"],
        queryFn: async () => {
            const { data } = await api.get("/admin/analytics");
            return data;
        },
    });
};