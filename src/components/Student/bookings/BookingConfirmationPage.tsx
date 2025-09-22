/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CalendarDays, Clock, Package } from "lucide-react";
import dayjs from "dayjs";
import { Badge } from '@/components/ui/badge';
import BookingForm from './BookingForm';

interface BookingConfirmationPageProps {
    tutor: any;
    selectedSlots: any[];
    onBack: () => void;
}

export default function BookingConfirmationPage({ tutor, selectedSlots, onBack }: BookingConfirmationPageProps) {
    const totalSlots = selectedSlots.length;

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Confirm Booking</h2>
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6">
                <Card className="shadow-sm">
                    <CardHeader className="p-4 border-b">
                        <CardTitle className="text-lg font-semibold">Your Selected Sessions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <ul className="space-y-3">
                            {selectedSlots.map((slot: any, index: number) => (
                                <li key={index} className="flex items-center gap-4 text-slate-700">
                                    <CalendarDays className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="font-medium">{dayjs(slot.startTime).tz(tutor.timeZone).format('dddd, MMM D')}</p>
                                        <p className="text-sm text-slate-500">{dayjs(slot.startTime).tz(tutor.timeZone).format('h:mm A')}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Booking form for final details */}
                <Card className="shadow-sm">
                    <CardContent className="p-6">
                        <BookingForm isPackageBooking={true} tutor={tutor} selectedSlots={selectedSlots} onClose={onBack} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}