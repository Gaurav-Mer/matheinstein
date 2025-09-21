/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import StudentForm from '../Admin/subjects/StudentForm';

interface StudentEditTabProps {
    student: any;
    onClose: () => void;
}

export default function StudentEditTab({ student, onClose }: StudentEditTabProps) {
    return (
        <Card className="shadow-sm">
            <CardContent className="p-6">
                <StudentForm
                    initialData={student}
                    onClose={onClose}
                />
            </CardContent>
        </Card>
    );
}