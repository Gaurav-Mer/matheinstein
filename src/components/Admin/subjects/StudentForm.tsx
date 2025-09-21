/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Loader2, UserPlus } from "lucide-react";

import { useAddStudent, useUpdateStudent } from "@/hooks/useStudents";
import { addStudentSchema, AddStudentInput } from "@/lib/schemas/studentSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTutors } from "@/hooks/useTutors";

interface StudentFormProps {
    initialData?: any;
    onClose?: () => void;
}

export default function StudentForm({ initialData, onClose }: StudentFormProps) {
    const { mutate: addStudent, isPending: isAdding } = useAddStudent();
    const { mutate: updateStudent, isPending: isUpdating } = useUpdateStudent();
    const { data: allTutors = [] } = useTutors();

    const { register, handleSubmit, watch, setValue, formState: { errors }, reset } =
        useForm<AddStudentInput>({
            resolver: zodResolver(addStudentSchema),
            defaultValues: initialData || {
                subjects: [],
                status: "onboarding",
                name: "",
                email: "",
                password: null,
                assignedTutorId: null,
                parentDetails: {
                    name: "",
                    email: "",
                    phone: "",
                },
                // New default values for address
                address: {
                    country: "",
                    state: "",
                    city: "",
                    street: "",
                },
            },
        });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const onSubmit = (data: AddStudentInput) => {
        if (initialData) {
            updateStudent({ uid: initialData.uid, ...data }, {
                onSuccess: () => {
                    toast.success("Student updated successfully!");
                    reset();
                    onClose?.();
                },
                onError: (err: any) => toast.error(err?.response?.data?.error || "Failed to update student"),
            });
        } else {
            addStudent(data, {
                onSuccess: () => {
                    toast.success("Invitation sent successfully! The student can now set their password.");
                    reset();
                    onClose?.();
                },
                onError: (err: any) => toast.error(err?.response?.data?.error || "Failed to add student"),
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Student Details Section */}
            <div>
                <h4 className="text-lg font-semibold mb-3">Student Details</h4>
                <div className="space-y-4">
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
                </div>
            </div>

            {/* Parent/Guardian Details Section */}
            <div>
                <h4 className="text-lg font-semibold mb-3">Parent/Guardian Details</h4>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="parentDetails.name">Parent&apos;s Name</Label>
                        <Input
                            id="parentDetails.name"
                            placeholder="Enter parent's full name"
                            {...register("parentDetails.name")}
                            className={errors.parentDetails?.name ? "border-red-500" : ""}
                        />
                        {errors.parentDetails?.name && <p className="text-sm text-red-500">{errors.parentDetails.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="parentDetails.email">Parent&apos;s Email</Label>
                        <Input
                            id="parentDetails.email"
                            type="email"
                            placeholder="Enter parent's email"
                            {...register("parentDetails.email")}
                            className={errors.parentDetails?.email ? "border-red-500" : ""}
                        />
                        {errors.parentDetails?.email && <p className="text-sm text-red-500">{errors.parentDetails.email.message}</p>}
                    </div>
                </div>
            </div>

            {/* New: Address Details Section */}
            <div>
                <h4 className="text-lg font-semibold mb-3">Address Details</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="address.country">Country</Label>
                        <Input
                            id="address.country"
                            placeholder="e.g., India"
                            {...register("address.country")}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address.state">State</Label>
                        <Input
                            id="address.state"
                            placeholder="e.g., Rajasthan"
                            {...register("address.state")}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address.city">City</Label>
                        <Input
                            id="address.city"
                            placeholder="e.g., Jaipur"
                            {...register("address.city")}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address.street">Street Address</Label>
                        <Input
                            id="address.street"
                            placeholder="e.g., 123 Main St."
                            {...register("address.street")}
                        />
                    </div>
                </div>
            </div>

            {/* Assigned Tutor */}
            <div className="space-y-2 w-full">
                <Label htmlFor="tutor">Assign Tutor</Label>
                <Select
                    value={watch("assignedTutorId") || ''}
                    onValueChange={(value) => setValue("assignedTutorId", value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a tutor" />
                    </SelectTrigger>
                    <SelectContent>
                        {allTutors.map((tutor: any) => (
                            <SelectItem key={tutor.uid} value={tutor.uid}>
                                {tutor.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Submit */}
            <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={onClose} disabled={isAdding || isUpdating}>
                    Cancel
                </Button>
                <Button type="submit" className="gap-2" disabled={isAdding || isUpdating}>
                    {isAdding || isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                    {initialData ? "Update Student" : "Invite Student"}
                </Button>
            </div>
        </form>
    );
}