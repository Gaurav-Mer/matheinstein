/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useRescheduleBooking } from '@/hooks/useBookingManagement';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CalendarDays, Save, Clock, Users, BookOpen } from "lucide-react";
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useStudentBookings } from '@/hooks/students/useStudentBookings';
import BookingCalendar from '@/components/Student/bookings/BookingCalendar';
import StudentLayout from '../../_layout';

export default function StudentReschedulePage() {
    const params = useParams();
    const router = useRouter();
    const bookingId = params.id as string;

    // ⚠️ CRITICAL: In a real app, you would fetch only the single booking.
    // We are fetching all bookings for simplicity here.
    const { data: bookings, isLoading } = useStudentBookings({ status: 'upcoming' });
    const { mutate: reschedule, isPending: isRescheduling } = useRescheduleBooking();

    const currentBooking = bookings?.find((b: any) => b.id === bookingId);

    // State for the new slot selection
    const [newSlot, setNewSlot] = useState<any>(null);

    if (isLoading) {
        return <Loader2 className="h-10 w-10 animate-spin text-gray-500 mx-auto mt-20" />;
    }

    if (!currentBooking) {
        return <p className='text-center mt-20'>Booking not found or already completed.</p>;
    }

    const tutor = currentBooking.tutor;

    const handleReschedule = () => {
        if (!newSlot || !newSlot.startTime || !newSlot.endTime) {
            return toast.error("Please select a new time slot.");
        }

        reschedule({
            bookingId: currentBooking.id,
            newStartTime: newSlot.startTime,
            newEndTime: newSlot.endTime,
        }, {
            onSuccess: () => {
                // Redirect user back to the main booking list after success
                router.push('/student/bookings');
            },
        });
    };

    return (
        <StudentLayout>
            <div className="p-6 md:p-10 min-h-screen bg-gray-50">
                <Link href="/student/bookings">
                    <Button variant="outline" className="mb-6"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Schedule</Button>
                </Link>

                <Card className="shadow-lg rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            Reschedule Lesson with {tutor?.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Current Booking Summary */}
                        <div className="lg:col-span-1 space-y-4 p-4 border rounded-xl bg-slate-50">
                            <h4 className="text-lg font-semibold">Current Slot</h4>
                            <p className="text-sm text-slate-600 flex items-center gap-2">
                                <CalendarDays className="h-4 w-4" />
                                {format(currentBooking.startTime.toDate(), 'PPP')}
                            </p>
                            <p className="text-sm text-slate-600 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {format(currentBooking.startTime.toDate(), 'p')}
                            </p>
                            <p className="text-sm text-slate-600 flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                {currentBooking.subject}
                            </p>
                        </div>

                        {/* New Slot Selection Calendar */}
                        <div className="lg:col-span-2">
                            <h4 className="text-lg font-semibold mb-3">Select New Time</h4>
                            <BookingCalendar
                                tutor={tutor}
                                onSlotSelect={setNewSlot} // Set state with new slot
                                selectedSlots={newSlot ? [newSlot] : []} // Highlight the single new selection
                            />
                            <div className="mt-6 flex justify-end">
                                <Button
                                    onClick={handleReschedule}
                                    disabled={isRescheduling || !newSlot}
                                    className="gap-2"
                                >
                                    {isRescheduling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Confirm Reschedule
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </StudentLayout>
    );
}