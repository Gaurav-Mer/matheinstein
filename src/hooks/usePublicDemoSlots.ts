/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface DemoSlotsQuery {
    userId: string;
    month: string;
}

export const usePublicDemoSlots = (query: DemoSlotsQuery) => {
    return useQuery<any, Error>({
        queryKey: ["public-demo-slots"],
        queryFn: async () => {
            const { data } = await axios.get("/api/public/demo-slots", { params: query });
            return data;
        },
        // Only run the query if a valid ID is provided
        // enabled: false,
        refetchOnMount: false
    });
};