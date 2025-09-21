/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useRouter } from 'next/router'; // Or from 'next/navigation' for App Router
import { Loader2 } from 'lucide-react';
import StudentDetails from '@/components/Student/StudentDetails';
import AdminLayout from '../_layout';

export default function StudentDetailsPage() {
    const router = useRouter();
    const { id } = router.query;

    if (!id) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
            </div>
        );
    }

    // Pass the student ID to the StudentDetails component.
    // The `canEdit` prop controls admin-level actions.
    return (
        <AdminLayout>
            <StudentDetails canEdit={true} />
        </AdminLayout>
    );
}