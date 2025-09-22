/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddTutorInput, addTutorSchema } from '@/lib/schemas/tutorSchema';
import { toast } from 'react-toastify';
import { useTutorProfile, useUpdateTutorProfile } from '@/hooks/tutors/useTutorProfile';
import TutorLayout from '../_layout';
import TutorBookingSettings from '@/components/tutor/TutorBookingSettings';
import TutorAvailability from '@/components/Admin/TutorAvailability';

export default function TutorAvailabilityPage() {
    const { data: tutor, isLoading, error, refetch } = useTutorProfile();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateTutorProfile();

    const methods = useForm<AddTutorInput>({
        resolver: zodResolver(addTutorSchema),
        defaultValues: {
            availability: [],
            timeZone: "Asia/Kolkata",
            bufferTime: 15,
            sessionDuration: { min: 30, max: 60 },
            bookingWindow: { minAdvanceNotice: 24, maxAdvanceNotice: 30 },
        },
    });

    useEffect(() => {
        if (tutor) {
            methods.reset(tutor);
        }
    }, [tutor, methods]);

    const onSubmit: SubmitHandler<AddTutorInput> = (data) => {
        updateProfile(data, {
            onSuccess: () => {
                toast.success("Availability and booking settings updated successfully!");
                refetch();
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.error || "Failed to update settings.");
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
            </div>
        );
    }

    if (error || !tutor) {
        return <p className="text-center text-red-500 mt-20">Failed to load profile data.</p>;
    }

    return (
        <TutorLayout>
            <div className="p-6  bg-white">
                <div className="mb-6 md:mb-10">
                    <h1 className="text-3xl font-bold text-slate-800">Set Your Availability</h1>
                    <p className="text-slate-500 mt-1">Manage your working hours and booking rules</p>
                </div>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 " >
                        <TutorBookingSettings />

                        <TutorAvailability control={methods.control} initialData={tutor.availability} />

                        <div className="flex justify-end">
                            <Button type="submit" className="gap-2" disabled={isUpdating}>
                                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save Settings
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </TutorLayout>
    );
}