/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/tutor/useTutorEarnings.ts
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";

// Define the expected structure returned by the API
interface TutorEarningsData {
    totalCompletedLessons: number;
    totalPayoutLiability: number; // The amount owed to the tutor
    compensationCurrency: string;
    transactions: any[]; // List of completed bookings for audit
}

export const useTutorEarnings = () => {
    return useQuery<TutorEarningsData, Error>({
        queryKey: ["tutor-earnings"],
        queryFn: async () => {
            const { data } = await api.get("/tutor/earnings");
            return data as any;
        },
    });
};