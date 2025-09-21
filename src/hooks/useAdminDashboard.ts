/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export const useAdminDashboard = () => {
    return useQuery({
        queryKey: ["admin-dashboard"],
        queryFn: async () => {
            const { data } = await api.get("/admin/dashboard");
            return data;
        },
    });
};