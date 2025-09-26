/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Define the expected structure of a subject item
interface Subject {
    id: string;
    name: string;
    status: string;
}

export const usePublicSubjects = () => {
    return useQuery<Subject[], Error>({
        queryKey: ["public-subjects"],
        queryFn: async () => {
            // This calls the public, unauthenticated API endpoint we created
            const { data } = await axios.get("/api/public/subjects");
            return data;
        },
        // Since subjects rarely change, we set a long stale time for better performance
        staleTime: 1000 * 60 * 60, // 1 hour
        refetchOnMount: false
    });
};