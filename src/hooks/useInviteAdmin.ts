/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { toast } from "react-toastify";
import { z } from "zod";

const inviteAdminSchema = z.object({
    name: z.string().min(2, "Name is required."),
    email: z.string().email("Invalid email address."),
});

type InviteAdminInput = z.infer<typeof inviteAdminSchema>;

export const useInviteAdmin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newAdmin: InviteAdminInput) => {
            const { data } = await api.post("/admin/invite-admin", newAdmin);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
            toast.success("Admin invitation sent successfully!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to invite admin.");
        },
    });
};