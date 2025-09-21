/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import StudentsList from '@/components/Admin/subjects/StudentsList';

export default function StudentsPage() {

    // Pass the fetched data and permissions to the StudentsList component
    return (
        <div className="p-6 md:p-10 h-full bg-primary/5">
            <StudentsList canAdd={true} canView={true} canDelete={true} />
        </div>
    );
}