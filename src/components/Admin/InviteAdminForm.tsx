/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";
import { useInviteAdmin } from "@/hooks/useInviteAdmin";
import { toast } from 'react-toastify';

const inviteAdminSchema = z.object({
    name: z.string().min(2, "Name is required."),
    email: z.string().email("Invalid email address."),
});
type InviteAdminInput = z.infer<typeof inviteAdminSchema>;

interface InviteAdminFormProps {
    onClose?: () => void;
}

export default function InviteAdminForm({ onClose }: InviteAdminFormProps) {
    const { mutate: inviteAdmin, isPending: isInviting } = useInviteAdmin();

    const { register, handleSubmit, formState: { errors }, reset } =
        useForm<InviteAdminInput>({
            resolver: zodResolver(inviteAdminSchema),
        });

    const onSubmit = (data: InviteAdminInput) => {
        inviteAdmin(data, {
            onSuccess: () => {
                reset();
                onClose?.();
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.error || "Failed to invite admin.");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    placeholder="Enter full name"
                    {...register("name")}
                    className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={isInviting}>
                    Cancel
                </Button>
                <Button type="submit" className="gap-2" disabled={isInviting}>
                    {isInviting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Send Invitation
                </Button>
            </div>
        </form>
    );
}