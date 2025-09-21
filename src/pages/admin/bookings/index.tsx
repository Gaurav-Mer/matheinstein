/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useAdminBookings } from '@/hooks/useAdminBookings';
import BookingsList from '@/components/Admin/bookings/BookingsList';
import AdminLayout from '../_layout';

export default function BookingsPage() {
    const { isLoading, error } = useAdminBookings();

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
                <p>Failed to load bookings data.</p>
                <p>Error: {error.message}</p>
            </div>
        );
    }

    // The BookingsList component handles its own data fetching and rendering
    return (
        <AdminLayout>
            <div className="p-6 bg-white">
                <BookingsList />
            </div>
        </AdminLayout>
    );
}