/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useStudentProfile, useUpdateStudentProfile } from "@/hooks/useStudentProfile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, User, Mail, Phone, Edit, Save, X, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddStudentInput, addStudentSchema } from '@/lib/schemas/studentSchema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import StudentLayout from './_layout';

export default function StudentProfilePage() {
    const { data: student, isLoading, error, refetch } = useStudentProfile();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateStudentProfile();
    const [isEditing, setIsEditing] = useState(false);

    const methods = useForm<AddStudentInput>({
        resolver: zodResolver(addStudentSchema),
        defaultValues: student,
    });

    useEffect(() => {
        if (student) {
            methods.reset(student);
        }
    }, [student, methods]);

    const onSubmit: SubmitHandler<AddStudentInput> = (data) => {
        const { ...updateData } = data; // Prevent sending password from this form
        updateProfile(updateData, {
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

    if (error || !student) {
        return <p className="text-center text-red-500 mt-20">Failed to load student profile.</p>;
    }

    const renderReadOnlyField = (label: string, value: string | null | undefined, placeholder: string = "N/A") => (
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-gray-800">{value || placeholder}</p>
        </div>
    );

    return (
        <StudentLayout>
            <div className="p-6 ">
                {/* Header and Actions */}
                <div className="flex justify-between items-center mb-6 md:mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-primary/20 text-primary">
                            <User className="h-7 w-7" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
                            <p className="text-gray-500">{student.email}</p>
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
                        {/* Main Tabs Section */}
                        <Tabs defaultValue="profile">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="profile">Profile</TabsTrigger>
                                <TabsTrigger value="parent">Parent Details</TabsTrigger>
                            </TabsList>

                            {/* Profile Tab */}
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
                                                            <Label htmlFor="phone">Phone</Label>
                                                            <Input id="phone" {...methods.register('phone')} />
                                                            {methods.formState.errors.phone && <p className="text-sm text-red-500">{methods.formState.errors.phone.message}</p>}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {renderReadOnlyField("Full Name", student.name)}
                                                        {renderReadOnlyField("Email", student.email)}
                                                        {renderReadOnlyField("Phone", student.phone)}
                                                        {renderReadOnlyField("Role", student.role, "N/A")}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-lg font-semibold mb-2">Address Details</h4>
                                                {isEditing ? (
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="address.country">Country</Label>
                                                            <Input id="address.country" {...methods.register('address.country')} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="address.state">State</Label>
                                                            <Input id="address.state" {...methods.register('address.state')} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="address.city">City</Label>
                                                            <Input id="address.city" {...methods.register('address.city')} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="address.street">Street</Label>
                                                            <Input id="address.street" {...methods.register('address.street')} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {renderReadOnlyField("Country", student.address?.country)}
                                                        {renderReadOnlyField("State", student.address?.state)}
                                                        {renderReadOnlyField("City", student.address?.city)}
                                                        {renderReadOnlyField("Street", student.address?.street)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Parent Details Tab */}
                            <TabsContent value="parent" className="mt-4">
                                <Card className="shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <h4 className="text-lg font-semibold mb-2">Parent/Guardian Info</h4>
                                                {isEditing ? (
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="parentDetails.name">Parent Name</Label>
                                                            <Input id="parentDetails.name" {...methods.register('parentDetails.name')} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="parentDetails.email">Parent Email</Label>
                                                            <Input id="parentDetails.email" type="email" {...methods.register('parentDetails.email')} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="parentDetails.phone">Parent Phone</Label>
                                                            <Input id="parentDetails.phone" {...methods.register('parentDetails.phone')} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {renderReadOnlyField("Parent Name", student.parentDetails?.name)}
                                                        {renderReadOnlyField("Parent Email", student.parentDetails?.email)}
                                                        {renderReadOnlyField("Parent Phone", student.parentDetails?.phone)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </form>
                </FormProvider>
            </div>
        </StudentLayout>
    );
}

