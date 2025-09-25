/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRescheduleBooking } from '@/hooks/useBookingManagement';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CalendarDays, Save, Clock, BookOpen } from "lucide-react";
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import Link from 'next/link';
import BookingCalendar from './Student/bookings/BookingCalendar';

interface RescheduleFormProps {
    currentBooking: any;
    userRole: string;
}

export default function RescheduleForm({ currentBooking, userRole }: RescheduleFormProps) {
    const router = useRouter();
    const { mutate: reschedule, isPending: isRescheduling } = useRescheduleBooking();
    const [newSlot, setNewSlot] = useState<any>(null); // Stores { startTime, endTime }

    const tutor = currentBooking.tutor;

    const handleReschedule = () => {
        if (!newSlot || !newSlot.startTime || !newSlot.endTime) {
            return toast.error("Please select a new time slot.");
        }

        reschedule({
            bookingId: currentBooking.id,
            newStartTime: newSlot.startTime, // UTC ISO String
            newEndTime: newSlot.endTime,     // UTC ISO String
        }, {
            onSuccess: () => {
                // Redirect user back to the main booking list after success
                const dashboardPath = userRole === 'admin' ? '/admin/bookings' : '/tutor/bookings';
                router.push(dashboardPath);
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.error || "Failed to reschedule lesson.");
            },
        });
    };

    const formatTime = (time: any) => dayjs(time).toDate(); // Convert Firestore Timestamp to Date object

    return (
        <div className="p-6 md:p-10 min-h-screen bg-gray-50">
            <Link href={`/${userRole}/bookings`}>
                <Button variant="outline" className="mb-6"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Schedule</Button>
            </Link>

            <Card className="shadow-lg rounded-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-slate-800">
                        Reschedule Lesson with {tutor?.name}
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Current Booking Summary */}
                    <div className="lg:col-span-1 space-y-4 p-4 border rounded-xl bg-slate-50 h-fit">
                        <h4 className="text-lg font-semibold border-b pb-2">Lesson Details</h4>
                        <p className="text-sm text-slate-600 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            {currentBooking.subject}
                        </p>
                        <p className="text-sm text-slate-600 flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            Old Date: {format(formatTime(currentBooking.startTime), 'PPP')}
                        </p>
                        <p className="text-sm text-slate-600 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Old Time: {format(formatTime(currentBooking.startTime), 'p')}
                        </p>
                        {newSlot && (
                            <div className='mt-4 pt-4 border-t border-dashed'>
                                <h4 className="text-md font-bold text-green-600">New Slot Selected</h4>
                                <p className="text-sm text-green-600">
                                    {dayjs(newSlot.startTime).format('PPP')} at {dayjs(newSlot.startTime).format('p')}
                                </p>
                            </div>
                        )}
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
    );
}

// Note: You would also need a way to fetch the single booking details for the current ID in the URL.