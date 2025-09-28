/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

interface TutorEarningSummary {
    uid: string;
    name: string;
    email: string;
    lessons: number;
    payout: number; // Total amount owed (in INR)
}

export const useAdminEarnings = () => {
    return useQuery<TutorEarningSummary[], Error>({
        queryKey: ["admin-earnings-report"],
        queryFn: async () => {
            const { data } = await api.get("/admin/earnings");
            return data;
        },
    });
};