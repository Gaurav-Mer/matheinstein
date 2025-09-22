/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useStudentTutors = () => {
    return useQuery({
        queryKey: ["student-tutors"],
        queryFn: async () => {
            const { data } = await api.get("/student/tutors");
            return data;
        },
    });
};