/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StudentForm from '@/components/Admin/subjects/StudentForm';

export default function AddStudentPage() {
    return (
        <div className="p-6 md:p-10 min-h-dvh  bg-primary/5 ">
            <div className="flex justify-between items-center mb-6 md:mb-10 lg:max-w-3xl mx-auto">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-secondary/10 text-secondary">
                        <UserPlus className="h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Add New Student</h1>
                        <p className="text-gray-500">Create a new student account on the platform.</p>
                    </div>
                </div>
                <Link href="/admin/students">
                    <Button variant="outline">
                        Back to Students
                    </Button>
                </Link>
            </div>

            <Card className="shadow-lg rounded-xl lg:max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Student Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <StudentForm />
                </CardContent>
            </Card>
        </div>
    );
}