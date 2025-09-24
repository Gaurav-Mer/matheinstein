/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Save, Loader2, Tag } from "lucide-react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { AddTutorInput, addTutorSchema } from "@/lib/schemas/tutorSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useUpdateTutor } from "@/hooks/useTutors"; // Assuming this hook handles updating the paidLessons array
import { toast } from "react-toastify";
import TutorPackageManager from "@/components/packages/TutorPackageManager"; // Assuming this is the core component
import { Badge } from "@/components/ui/badge";
import { useWatch } from "react-hook-form";

interface TutorPricingTabProps {
    tutor: any;
    canEdit: boolean;
}

// 💡 NEW COMPONENT: Self-contained form logic for pricing
export default function TutorPricingTab({ tutor, canEdit }: TutorPricingTabProps) {
    const { mutate: updateTutor, isPending: isUpdating } = useUpdateTutor();

    // 1. Initialize the form with data ONLY RELEVANT to pricing/packages
    const methods = useForm<AddTutorInput>({
        resolver: zodResolver(addTutorSchema),
        defaultValues: {
            paidLessons: tutor.paidLessons || [],
            name: tutor?.name,
            email: tutor?.email
        },
    });

    // 💡 FIX: Reset form when the tutor data prop changes (essential for edit flow)
    useEffect(() => {
        if (tutor) {
            methods.reset({ paidLessons: tutor.paidLessons || [], name: tutor?.name, email: tutor?.email });
        }
    }, [tutor, methods]);

    // Use useWatch inside the form to get a reactive count
    const packages = useWatch({
        control: methods.control,
        name: 'paidLessons',
        defaultValue: [],
    }) || [];


    const onSubmit: SubmitHandler<AddTutorInput> = (data) => {
        if (!canEdit) {
            toast.error("You do not have permission to edit.");
            return;
        }

        updateTutor({
            uid: tutor.uid,
            // ⚠️ Send only the paidLessons array to the API
            paidLessons: data.paidLessons,
        }, {
            onSuccess: () => {
                toast.success("Pricing and packages updated successfully!");
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.error || "Failed to update pricing.");
            },
        });
    };

    return (
        <FormProvider {...methods}>
            <Card className="shadow-sm border-none">
                <CardHeader className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <DollarSign className="h-6 w-6 text-primary" />
                        <h4 className="text-xl font-bold text-slate-800">
                            Pricing & Packages for {tutor?.name || 'Tutor'}
                        </h4>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {/* Package Count Card - Now updates instantly */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border">
                        <div className='flex items-center gap-3'>
                            <Tag className="h-5 w-5 text-primary" />
                            <p className="font-semibold text-slate-700">Total Packages Defined</p>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                            {packages.length}
                        </Badge>
                    </div>

                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Renders the full package management UI */}
                        <TutorPackageManager />

                        {canEdit && (
                            <div className="flex justify-end pt-4">
                                <Button type="submit" className="gap-2" disabled={isUpdating}>
                                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Save Packages
                                </Button>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </FormProvider>
    );
}