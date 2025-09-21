/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { toast } from "react-toastify";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import TutorAvailability from "./TutorAvailability";
import { useUpdateAdminProfile } from "@/hooks/useAdminProfile";
import { AdminInput, adminSchema } from "@/lib/schemas/adminSchema";
import TutorBookingSettings from '../tutor/TutorBookingSettings';

interface AdminProfileFormProps {
    initialData: any;
    onClose: () => void;
}

export default function AdminProfileForm({ initialData, onClose }: AdminProfileFormProps) {
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateAdminProfile();
    const methods = useForm<AdminInput>({
        resolver: zodResolver(adminSchema),
        defaultValues: initialData,
    });
    const { register, handleSubmit, formState: { errors }, control } = methods;

    const onSubmit = (data: AdminInput) => {
        const updateData: any = {
            uid: initialData.uid,
            ...data,
        };

        // Remove password if empty
        if (!data.password) {
            delete updateData.password;
        }

        updateProfile(updateData, {
            onSuccess: () => {
                toast.success("Profile updated successfully!");
                onClose();
            },
            onError: (err: any) => toast.error(err?.response?.data?.error || "Failed to update profile."),
        });
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="profile">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="availability">Availability</TabsTrigger>
                    </TabsList>

                    <Card className="shadow-none border-none mt-4">
                        <CardContent className="p-0">
                            {/* Profile Tab */}
                            <TabsContent value="profile" className="space-y-4 mt-0">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Your name"
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
                                        placeholder="Your email"
                                        {...register("email")}
                                        className={errors.email ? "border-red-500" : ""}
                                    />
                                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password (leave blank to keep unchanged)</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter new password"
                                        {...register("password")}
                                        className={errors.password ? "border-red-500" : ""}
                                    />
                                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                                </div>
                            </TabsContent>

                            {/* Availability Tab */}
                            <TabsContent value="availability" className="space-y-4 mt-0">
                                <TutorBookingSettings />
                                <TutorAvailability control={control} initialData={initialData?.availability} />
                            </TabsContent>
                        </CardContent>
                    </Card>
                </Tabs>
                <div className="flex justify-end gap-2 mt-6">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" className="gap-2" disabled={isUpdating}>
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}