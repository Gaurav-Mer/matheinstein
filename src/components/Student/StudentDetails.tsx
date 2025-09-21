/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStudent, useDeleteStudent } from "@/hooks/useStudents";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, User, Edit, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import StudentEditTab from './StudentEditTab';
import StudentProfileTab from './StudentProfileTab';
import StudentTutorAssignmentTab from './StudentTutorAssignmentTab';
import Link from 'next/link';

interface StudentDetailsProps {
    canEdit: boolean;
}

export default function StudentDetails({ canEdit }: StudentDetailsProps) {
    const router = useRouter();
    const params = useParams();
    const studentId = params?.id as string;

    const { data: student, isLoading, error, refetch } = useStudent(studentId);
    const { mutate: deleteStudent, isPending: isDeleting } = useDeleteStudent();

    const [activeTab, setActiveTab] = useState("profile");

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-dvh bg-slate-50/50 rounded-2xl">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !student) {
        return <p className="text-center text-red-500 mt-20">Failed to load student details.</p>;
    }

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
            deleteStudent(studentId, {
                onSuccess: () => {
                    toast.success("Student deleted successfully!");
                    router.push("/admin/students");
                },
                onError: (err: any) => {
                    toast.error(err?.response?.data?.error || "Failed to delete student.");
                }
            });
        }
    };

    return (
        <div className="p-6 md:p-10 min-h-dvh bg-slate-50">
            {/* Header and Actions */}
            <div className="flex justify-between items-center mb-6 md:mb-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                        <User className="h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
                        <p className="text-gray-500">{student.email}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/students">
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Students
                        </Button>
                    </Link>
                    {canEdit && (
                        <Button variant="destructive" className="gap-2" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            Delete
                        </Button>
                    )}
                </div>
            </div>

            {/* Tabs Section */}
            <Card className="shadow-lg rounded-xl overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <CardHeader className="p-0 border-b border-slate-200">
                        <TabsList className="grid w-full grid-cols-3 bg-white h-full p-4 gap-2">
                            <TabsTrigger value="profile" >
                                Profile
                            </TabsTrigger>
                            {canEdit && (
                                <TabsTrigger value="edit">
                                    Edit Profile
                                </TabsTrigger>
                            )}
                            <TabsTrigger value="tutor">
                                Tutor
                            </TabsTrigger>
                        </TabsList>
                    </CardHeader>
                    <CardContent className="p-6 bg-white">
                        <TabsContent value="profile" className="mt-0">
                            <StudentProfileTab student={student} />
                        </TabsContent>
                        {canEdit && (
                            <TabsContent value="edit" className="mt-0">
                                <StudentEditTab student={student} onClose={() => refetch()} />
                            </TabsContent>
                        )}
                        <TabsContent value="tutor" className="mt-0">
                            <StudentTutorAssignmentTab student={student} />
                        </TabsContent>
                    </CardContent>
                </Tabs>
            </Card>
        </div >
    );
}