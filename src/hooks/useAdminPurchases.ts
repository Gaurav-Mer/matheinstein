/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

// Define the core transaction structure for the frontend
interface AdminPurchaseTransaction {
    id: string;
    studentId: string;
    tutorId: string;
    studentName: string;
    tutorName: string;
    totalAmountINR: number;
    creditsPurchased: number;
    purchaseDate: string;
    status: 'paid' | 'pending' | 'failed';
}

export const useAdminPurchases = () => {
    return useQuery<AdminPurchaseTransaction[], Error>({
        queryKey: ["admin-purchases"],
        queryFn: async () => {
            const { data } = await api.get("/admin/purchases");
            return data;
        },
    });
};