/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, User, Edit, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddTutorInput, addTutorSchema } from '@/lib/schemas/tutorSchema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import TutorLayout from './_layout';
import { useTutorProfile, useUpdateTutorProfile } from '@/hooks/tutors/useTutorProfile';
import TutorBookingSettings from '@/components/tutor/TutorBookingSettings';
import TutorAvailability from '@/components/Admin/TutorAvailability';
import TutorPackageManager from '@/components/packages/TutorPackageManager';

export default function TutorProfilePage() {
    const { data: tutor, isLoading, error, refetch } = useTutorProfile();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateTutorProfile();
    const [isEditing, setIsEditing] = useState(false);

    const methods = useForm<AddTutorInput>({
        resolver: zodResolver(addTutorSchema),
        defaultValues: tutor,
    });

    useEffect(() => {
        if (tutor) {
            methods.reset(tutor);
        }
    }, [tutor, methods]);

    const onSubmit: SubmitHandler<AddTutorInput> = (data) => {

        updateProfile(data, {
            onSuccess: () => {
                toast.success("Profile updated successfully!");
                setIsEditing(false);
                refetch();
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.error || "Failed to update profile.");
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
        return <p className="text-center text-red-500 mt-20">Failed to load tutor profile.</p>;
    }

    const renderReadOnlyField = (label: string, value: string | null | undefined, placeholder: string = "N/A") => (
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-gray-800">{value || placeholder}</p>
        </div>
    );

    return (
        <TutorLayout>
            <div className="p-6  bg-white">
                {/* Header and Actions */}
                <div className="flex justify-between items-center mb-6 md:mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-primary/20 text-primary">
                            <User className="h-7 w-7" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{tutor.name}</h1>
                            <p className="text-gray-500">{tutor.email}</p>
                        </div>
                    </div>
                    {!isEditing ? (
                        <Button className="gap-2" onClick={() => setIsEditing(true)}>
                            <Edit className="h-4 w-4" />
                            Edit Profile
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                            <Button className="gap-2" onClick={methods.handleSubmit(onSubmit)} disabled={isUpdating}>
                                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save
                            </Button>
                        </div>
                    )}
                </div>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                        <Tabs defaultValue="profile">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="profile">Profile</TabsTrigger>
                                <TabsTrigger value="availability">Availability</TabsTrigger>
                                <TabsTrigger value="pricing">Packages</TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile" className="mt-4">
                                <Card className="shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <h4 className="text-lg font-semibold mb-2">Basic Info</h4>
                                                {isEditing ? (
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="name">Full Name</Label>
                                                            <Input id="name" {...methods.register('name')} />
                                                            {methods.formState.errors.name && <p className="text-sm text-red-500">{methods.formState.errors.name.message}</p>}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="email">Email</Label>
                                                            <Input id="email" type="email" {...methods.register('email')} />
                                                            {methods.formState.errors.email && <p className="text-sm text-red-500">{methods.formState.errors.email.message}</p>}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="password">New Password</Label>
                                                            <Input id="password" type="password" placeholder="Leave blank to keep current" {...methods.register('password')} />
                                                            {methods.formState.errors.password && <p className="text-sm text-red-500">{methods.formState.errors.password.message}</p>}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {renderReadOnlyField("Full Name", tutor.name)}
                                                        {renderReadOnlyField("Email", tutor.email)}
                                                        {renderReadOnlyField("Role", tutor.role, "N/A")}
                                                        {renderReadOnlyField("Joined", new Date(tutor.createdAt).toLocaleDateString())}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-lg font-semibold mb-2">Contact & Bio</h4>
                                                {isEditing ? (
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="phone">Phone</Label>
                                                            <Input id="phone" {...methods.register('phone')} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="bio">Bio</Label>
                                                            <Input id="bio" {...methods.register('bio')} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {renderReadOnlyField("Phone", tutor.phone)}
                                                        {renderReadOnlyField("Bio", tutor.bio)}
                                                        {renderReadOnlyField("Subjects", tutor.subjects?.join(', '))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="availability" className="space-y-6 mt-4">
                                <TutorBookingSettings />
                                <TutorAvailability control={methods.control} initialData={tutor.availability} />
                            </TabsContent>

                            {/* NEW: Pricing & Packages Tab */}
                            <TabsContent value="pricing" className="space-y-6 mt-4">
                                <TutorPackageManager />
                            </TabsContent>
                        </Tabs>
                    </form>
                </FormProvider>
            </div>
        </TutorLayout>
    );
}