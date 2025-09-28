/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

interface FinancialMetrics {
    totalGrossRevenue: number;
    totalPayoutLiability: number;
    netPlatformProfit: number;
    totalCreditsSold: number;
}

export const useAdminFinancialMetrics = () => {
    return useQuery<FinancialMetrics, Error>({
        queryKey: ["admin-financial-metrics"],
        queryFn: async () => {
            const { data } = await api.get("/admin/metrics/financial");
            return data;
        },
    });
};