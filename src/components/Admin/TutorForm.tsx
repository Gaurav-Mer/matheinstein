/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTutorSchema, AddTutorInput } from "@/lib/schemas/tutorSchema";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAddTutor, useTutors, useUpdateTutor } from "@/hooks/useTutors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSubjects } from "@/hooks/useSubjects";
import Link from "next/link";
import TutorAvailability from "./TutorAvailability";
import TutorBookingSettings from "../tutor/TutorBookingSettings";

interface TutorFormProps {
    initialData?: any; // for edit mode
    onClose?: () => void;
}

export default function TutorForm({ initialData, onClose }: TutorFormProps) {
    const { mutate: addTutor, isPending: isAdding } = useAddTutor();
    const { data: tutors, isLoading } = useTutors();

    const { mutate: updateTutor, isPending: isUpdating } = useUpdateTutor();
    const { data: allSubjects = [] } = useSubjects();

    const methods = useForm<AddTutorInput>({
        resolver: zodResolver(addTutorSchema),
        defaultValues: initialData || {
            subjects: [],
            status: "onboarding", // Default status for new tutors
            bio: "",
            name: "",
            email: "",
            // No password field for new tutors
            availability: [],
            timeZone: "Asia/Kolkata",
            bufferTime: 15,
            sessionDuration: { min: 30, max: 60 },
            bookingWindow: { minAdvanceNotice: 24, maxAdvanceNotice: 30 },
        },
    });

    const { register, handleSubmit, watch, setValue, formState: { errors }, reset, control } = methods;

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const onSubmit: SubmitHandler<AddTutorInput> = (data) => {
        if (initialData) {
            // For editing, only send the password if it's not empty
            if (!data.password) {
                delete data.password;
            }
            updateTutor({ uid: initialData.uid, ...data }, {
                onSuccess: () => {
                    toast.success("Tutor updated successfully!");
                    reset();
                    onClose?.();
                },
                onError: (err: any) => toast.error(err?.response?.data?.error || "Failed to update tutor"),
            });
        } else {
            // For new tutors, don't send a password
            const { password, ...newData } = data;
            addTutor(newData, {
                onSuccess: () => {
                    toast.success("Tutor invitation sent successfully!");
                    reset();
                    onClose?.();
                },
                onError: (err: any) => toast.error(err?.response?.data?.error || "Failed to invite tutor"),
            });
        }
    };

    const assignedSubjectIdsExcludingCurrent = tutors
        ?.filter((t: any) => t.uid !== initialData?.uid)
        ?.flatMap((t: any) => t.subjects);

    const availableSubjects = allSubjects.filter(
        (sub: any) => !assignedSubjectIdsExcludingCurrent.includes(sub.id)
    );
    if (isLoading) return <>loading...</>

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className=" h-full flex flex-col flex-1 overflow-auto gap-3">
                <div className="flex-1 overflow-auto p-4 flex flex-col gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                            id="name"
                            placeholder="Enter full name"
                            {...register("name")}
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter email"
                            {...register("email")}
                            className={errors.email ? "border-red-500" : ""}
                            disabled={!!initialData}
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>

                    {/* Password field only shown in edit mode */}
                    {initialData && (
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Password (leave blank to keep unchanged)
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Leave blank to keep current password"
                                {...register("password")}
                                className={errors.password ? "border-red-500" : ""}
                            />
                            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                        </div>
                    )}

                    {/* Subjects */}
                    <div className="space-y-2 relative">
                        <div className="space-y-2 relative">
                            <div className="flex items-center justify-between relative">
                                <Label>Subjects</Label>
                                <Link className="text-blue-700 text-xs underline" href={"/admin/subjects"}>Add new</Link>
                            </div>
                            <Select
                                value={watch("subjects")?.[0] || ''}
                                onValueChange={(values: string) => setValue("subjects", [values])}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select subjects" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableSubjects
                                        .map((sub: any) => (
                                            <SelectItem key={sub.id} value={sub.id}>
                                                {sub.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {errors.subjects && <p className="text-sm text-red-500 absolute -bottom-5">{errors.subjects?.message}</p>}
                    </div>

                    {/* Status */}
                    <div className="space-y-2 w-full">
                        <Label>Status</Label>
                        <Select
                            defaultValue={watch().status || ""}
                            onValueChange={(value) => setValue("status", value as "active" | "inactive" | "onboarding")}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="onboarding">Onboarding</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Booking Settings and Availability */}
                    <TutorBookingSettings />
                    <TutorAvailability control={control} initialData={initialData?.availability} />
                </div>
                {/* Submit */}
                <div className="flex gap-2 justify-end shrink-0 w-full p-4">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isAdding || isUpdating}>
                        Cancel
                    </Button>
                    <Button type="submit" className="gap-2" disabled={isAdding || isUpdating}>
                        {isAdding || isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                        {initialData ? "Update Tutor" : "Invite Tutor"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}