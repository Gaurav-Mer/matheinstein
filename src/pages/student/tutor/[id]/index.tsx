/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useRouter } from 'next/router'; // Or use 'next/navigation' for App Router
import { Loader2 } from 'lucide-react';
import TutorBookingPage from '@/components/Student/bookings/TutorBookingPage';

export default function PublicTutorPage() {
    const router = useRouter();
    const { id } = router.query;

    // Show a loading state if the ID is not yet available
    if (!id) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
            </div>
        );
    }

    return (
        <TutorBookingPage />
    );
}