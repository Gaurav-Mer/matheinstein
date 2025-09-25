/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Loader2, XCircle } from 'lucide-react';
import RescheduleForm from '@/components/RescheduleForm'; // Assuming this is the core form component
import { useSingleBooking } from '@/hooks/useSingleBooking';
import TutorLayout from '../../_layout'; // Assuming the layout component path

export default function TutorReschedulePageWrapper() {
    const params = useParams();
    // Access the booking ID from the URL using useParams
    const bookingId = params?.id as string;
    const { data: currentBooking, isLoading, error } = useSingleBooking(bookingId);


    if (isLoading || !bookingId) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-gray-500 mx-auto mt-20" />
            </div>
        );
    }

    // 🚨 FIX 2: Handle Error State (Booking not found or access denied)
    if (error || !currentBooking) {
        return (
            <div className="flex flex-col items-center justify-center h-96 bg-gray-50 p-6">
                <XCircle className='h-12 w-12 text-red-500 mb-4' />
                <p className='text-center text-red-700 font-semibold'>Error: Booking Not Found or Access Denied.</p>
                <p className='text-sm text-slate-500'>Please check the link or ensure the booking exists.</p>
            </div>
        );
    }

    // 🚨 FIX 1: The userRole must be 'tutor' for this route.
    return (
        <TutorLayout>
            <RescheduleForm currentBooking={currentBooking} userRole="tutor" />
        </TutorLayout>
    );
}