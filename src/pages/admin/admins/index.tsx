/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useAdmins } from '@/hooks/useAdmins';
import AdminsPage from '@/components/Admin/Admin';
import AdminLayout from '../_layout';

export default function AdminAdminsPage() {
    const { isLoading, error } = useAdmins();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 mt-20">
                <p>Failed to load admins data.</p>
                <p>Error: {error.message}</p>
            </div>
        );
    }

    // The AdminsPage component handles its own data fetching and rendering
    return (
        <AdminLayout>
            <AdminsPage />
        </AdminLayout>
    );
}