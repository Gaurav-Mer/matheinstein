/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export const useStudentDashboard = () => {
    return useQuery({
        queryKey: ["student-dashboard"],
        queryFn: async () => {
            const { data } = await api.get("/student");
            return data;
        },
    });
};