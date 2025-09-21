/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import StudentsList from '@/components/Admin/subjects/StudentsList';
import AdminLayout from '../_layout';

export default function StudentsPage() {

    // Pass the fetched data and permissions to the StudentsList component
    return (
        <AdminLayout>
            <div className="p-6 md:p-10 h-full bg-white">
                <StudentsList canAdd={true} canView={true} canDelete={true} />
            </div>
        </AdminLayout>
    );
}