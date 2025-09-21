/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDays, Save, Loader2 } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { AddTutorInput, addTutorSchema } from "@/lib/schemas/tutorSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useUpdateTutor } from "@/hooks/useTutors";
import { toast } from "react-toastify";
import TutorAvailability from "../Admin/TutorAvailability";
import TutorBookingSettings from "./TutorBookingSettings";
import { defaultBuffer, maxDuration, maxWindow, minDuration, minWindow } from "@/lib/constant";

interface AvailabilityTabProps {
    tutor: any;
    canEdit: boolean;
}

export default function AvailabilityTab({ tutor, canEdit }: AvailabilityTabProps) {
    const { mutate: updateTutor, isPending: isUpdating } = useUpdateTutor();

    const methods = useForm<AddTutorInput>({
        resolver: zodResolver(addTutorSchema),
        defaultValues: {
            availability: tutor.availability || [],
            timeZone: tutor.timeZone || null,
            bufferTime: tutor.bufferTime || defaultBuffer,
            sessionDuration: tutor.sessionDuration || { min: minDuration, max: maxDuration },
            bookingWindow: tutor.bookingWindow || {
                minAdvanceNotice: minWindow / 24,
                maxAdvanceNotice: maxWindow / 24
            },
        },
    });

    const onSubmit = (data: AddTutorInput) => {
        if (!canEdit) {
            toast.error("You do not have permission to edit.");
            return;
        }

        updateTutor({
            uid: tutor.uid,
            availability: data.availability,
            timeZone: data.timeZone,
            bufferTime: data.bufferTime,
            sessionDuration: data.sessionDuration,
            bookingWindow: data.bookingWindow,
        }, {
            onSuccess: () => {
                toast.success("Availability and booking settings updated successfully!");
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.error || "Failed to update settings.");
            },
        });
    };

    return (
        <FormProvider {...methods}>
            <Card className="shadow-sm border-none">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                        <CalendarDays className="h-5 w-5 text-gray-600" />
                        Availability & Booking Settings
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                        {/* The component with all the new booking settings */}
                        <TutorBookingSettings />

                        {/* The component for weekly availability slots */}
                        <TutorAvailability control={methods.control} />

                        {canEdit && (
                            <div className="flex justify-end">
                                <Button type="submit" className="gap-2" disabled={isUpdating}>
                                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Save Settings
                                </Button>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </FormProvider>
    );
}