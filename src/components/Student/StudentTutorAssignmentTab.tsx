/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, UserPlus, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useTutors } from "@/hooks/useTutors";
import { useUpdateStudent } from "@/hooks/useStudents";

interface StudentTutorAssignmentTabProps {
    student: any;
}

export default function StudentTutorAssignmentTab({ student }: StudentTutorAssignmentTabProps) {
    const { data: allTutors = [] } = useTutors();
    const { mutate: updateStudent, isPending } = useUpdateStudent();
    const { watch, setValue } = useForm({
        defaultValues: { assignedTutorId: student.assignedTutorId || '' },
    });

    const handleAssignTutor = () => {
        const newTutorId = watch('assignedTutorId');
        if (newTutorId === student.assignedTutorId) {
            return toast.info("No change in assigned tutor.");
        }

        updateStudent({ uid: student.uid, assignedTutorId: newTutorId }, {
            onSuccess: () => {
                toast.success("Tutor assigned successfully!");
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.error || "Failed to assign tutor.");
            }
        });
    };

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <BookOpen className="h-5 w-5" /> Tutor Assignment
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Currently Assigned</p>
                    <p className="text-gray-800">{student.assignedTutor?.name || "No tutor assigned"}</p>
                </div>
                <div>
                    <Label htmlFor="tutor">Assign a New Tutor</Label>
                    <div className="flex gap-2 items-end mt-1">
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
                        <Button
                            onClick={handleAssignTutor}
                            disabled={isPending}
                            className="gap-2 shrink-0"
                        >
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                            Assign
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}