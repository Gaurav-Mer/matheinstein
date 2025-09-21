/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Plus, UserPlus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useStudents, useTutorStudents } from "@/hooks/useStudents";

interface StudentsTabProps {
    tutor: any;
    canEdit: boolean;
    // allStudents and onAssignStudent will be added later
}

export default function StudentsTab({ tutor, canEdit }: StudentsTabProps) {
    const [showAssignForm, setShowAssignForm] = useState(false);
    const { data: allStudents, isLoading: isAllStudentsLoading } = useStudents();
    const { data: assignedStudents, isLoading: isAssignedStudentsLoading, error } = useTutorStudents(tutor?.uid ?? "");
    const { handleSubmit, reset, setValue } = useForm<{ studentId: string }>();


    if (isAssignedStudentsLoading || isAllStudentsLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-gray-500">No data found.</p>;
    }

    const unassignedStudents = allStudents?.filter(
        (student: any) => !assignedStudents.some((assignedStudent: any) => assignedStudent.uid === student.uid)
    ) || [];

    const onSubmit = (data: { studentId: string }) => {
        // This will be implemented in the next step
        toast.success(`Student ${data.studentId} will be assigned to tutor ${tutor.uid}.`);
        reset();
        setShowAssignForm(false);
    };

    return (
        <Card className="shadow-sm border-none">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                    <Users className="h-5 w-5 text-gray-600" />
                    Assigned Students
                </CardTitle>
                {canEdit && (
                    <Button
                        onClick={() => setShowAssignForm(!showAssignForm)}
                        variant="outline"
                        className="gap-2 text-primary border-primary hover:bg-blue-50"
                    >
                        {showAssignForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {showAssignForm ? "Cancel" : "New Assignment"}
                    </Button>
                )}
            </CardHeader>

            <CardContent>
                {/* Assign Student Form */}
                {canEdit && showAssignForm && (
                    <div className="bg-white p-6 rounded-xl mb-6 border border-gray-200">
                        <h4 className="flex items-center gap-2 text-lg font-semibold mb-4 text-gray-800">
                            <UserPlus className="h-5 w-5 text-primary" /> Assign a Student
                        </h4>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Label htmlFor="studentId" className="font-medium text-gray-700">Select Student</Label>
                                <Select
                                    onValueChange={(value) => setValue("studentId", value)}
                                >
                                    <SelectTrigger className="w-full mt-1">
                                        <SelectValue placeholder="Select a student" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {unassignedStudents?.length > 0 ? (
                                            unassignedStudents.map((student: any, i: number) => (
                                                <SelectItem key={student.uid} value={student.uid ?? i?.toString()}>
                                                    {student.name} ({student.email})
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="no" disabled>No unassigned students</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full gap-2">
                                Assign Student
                            </Button>
                        </form>
                    </div>
                )}

                {/* Students Table */}
                {assignedStudents?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <Table className="bg-white rounded-lg overflow-hidden shadow-sm min-w-[600px]">
                            <TableHeader className="bg-gray-100 dark:bg-gray-800">
                                <TableRow>
                                    <TableHead className="text-gray-600 font-semibold">Name</TableHead>
                                    <TableHead className="text-gray-600 font-semibold">Email</TableHead>
                                    <TableHead className="text-gray-600 font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignedStudents.map((student: any) => (
                                    <TableRow key={student.uid} className="hover:bg-white transition-colors">
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell className="text-gray-500">{student.email}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg">
                        <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                            <Users className="h-10 w-10" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">No students assigned</h3>
                        <p className="text-sm text-gray-500 mt-1 text-center">
                            This tutor does not have any students assigned yet.
                            {canEdit && " Use the 'New Assignment' button to add one."}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}