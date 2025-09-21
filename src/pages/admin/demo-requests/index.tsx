/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useAdminDemoRequests } from '@/hooks/useAdminDemoRequests';
import DemoRequestsList from '@/components/Admin/DemoRequestsList';
import AdminLayout from '../_layout';

export default function DemoRequestsPage() {
    const { isLoading, error } = useAdminDemoRequests();

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
                <p>Failed to load demo requests.</p>
                <p>Error: {error.message}</p>
            </div>
        );
    }

    return (
        <AdminLayout>
            <div className="bg-white">
                <DemoRequestsList />
            </div>
        </AdminLayout>
    );
}