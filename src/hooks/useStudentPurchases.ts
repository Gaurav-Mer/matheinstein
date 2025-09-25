/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

// Define the data structure for the frontend
interface PurchaseTransaction {
    id: string;
    packageName: string;
    creditsPurchased: number;
    totalAmountINR: number;
    purchaseDate: string;
    status: 'paid' | 'pending' | 'failed';
    // Add other fields as necessary
}

export const useStudentPurchases = () => {
    return useQuery<PurchaseTransaction[], Error>({
        queryKey: ["student-purchases"],
        queryFn: async () => {
            const { data } = await api.get("/student/purchases");
            return data;
        },
    });
};