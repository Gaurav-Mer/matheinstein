/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useMemo } from 'react';
import {
    ChevronLeft, ChevronRight,
    Clock, XCircle, Loader2
} from "lucide-react";
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { useTutorAvailableSlots } from '@/hooks/useTutorAvailableSlots';
import { DayPicker, Matcher } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // Ensure CSS is imported

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// Helper function to generate time slots (unchanged logic)
const generateTimeSlots = (date: dayjs.Dayjs, availability: any[], timeZone: string) => {
    // ... (Slot generation logic remains the same) ...
    const slots: any = [];
    const day = date.format('dddd').toLowerCase();
    const dayAvailability = availability.filter((slot) => slot.day === day);

    if (dayAvailability.length === 0) return [];

    const slotDuration = 60;
    const bufferTime = 15;

    dayAvailability.forEach(schedule => {
        let currentTime = dayjs(date.format('YYYY-MM-DD')).hour(parseInt(schedule.startTime.split(':')[0], 10)).minute(parseInt(schedule.startTime.split(':')[1], 10)).tz(timeZone);
        const endDateTime = dayjs(date.format('YYYY-MM-DD')).hour(parseInt(schedule.endTime.split(':')[0], 10)).minute(parseInt(schedule.endTime.split(':')[1], 10)).tz(timeZone);

        while (currentTime.isBefore(endDateTime)) {
            slots.push({
                startTime: currentTime.utc().toISOString(),
                endTime: currentTime.add(slotDuration, 'minute').utc().toISOString(),
            });
            currentTime = currentTime.add(slotDuration + bufferTime, 'minute');
        }
    });

    return slots;
};

// Helper function to filter out booked and past slots (unchanged)
const getAvailableTimeSlots = (date: dayjs.Dayjs, availability: any[], timeZone: string, bookedSlots: any[]) => {
    const allSlots = generateTimeSlots(date, availability, timeZone);
    return allSlots.filter(
        (slot: any) => dayjs(slot.startTime).isAfter(dayjs.utc()) && !bookedSlots.some(booked => dayjs(booked.startTime).isSame(dayjs(slot.startTime)))
    );
};

interface BookingCalendarProps {
    tutor: any;
    selectedSlots: any[];
    onSlotSelect: (slots: any[]) => void;
}

export default function BookingCalendar({ tutor, selectedSlots, onSlotSelect }: BookingCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

    // Calculate the range for the API query
    const queryParams = useMemo(() => ({
        tutorId: tutor?.uid,
        startDate: currentMonth.startOf('month').toISOString(),
        endDate: currentMonth.endOf('month').toISOString(),
    }), [tutor?.uid, currentMonth]);

    const { data: availabilityData, isLoading: isSlotsLoading } = useTutorAvailableSlots(queryParams);

    const monthlyAvailability = availabilityData?.availability || [];
    const tutorProfileRules = availabilityData?.profile || tutor;


    // 2. Client-Side Filtering: Filter the monthly slots down to the selected day
    const dailyAvailableSlots = useMemo(() => {
        if (!selectedDate || isSlotsLoading || !tutorProfileRules.availability) return [];

        // Use the generic getAvailableTimeSlots helper with the full monthly conflict data
        const bookedSlots = availabilityData?.bookedSlots || [];

        return getAvailableTimeSlots(selectedDate, tutorProfileRules.availability, tutorProfileRules.timeZone, bookedSlots);
    }, [selectedDate, availabilityData, isSlotsLoading, tutorProfileRules]);
    console.log("dailyAvailableSlots", dailyAvailableSlots)

    const handleSlotClick = (slot: any) => {
        const isSelected = selectedSlots.some(s => dayjs(s.startTime).isSame(dayjs(slot.startTime)));
        if (isSelected) {
            onSlotSelect(selectedSlots.filter(s => !dayjs(s.startTime).isSame(dayjs(slot.startTime))));
        } else {
            onSlotSelect([...selectedSlots, slot]);
        }
    };

    const handleDaySelect = (date: Date | undefined) => {
        // DayPicker passes a standard JS Date object
        setSelectedDate(date ? dayjs(date) : null);
    };

    // --- CRITICAL FIX: Define Modifiers for React-Day-Picker ---
    const availableDays: Matcher[] = useMemo(() => {
        // Returns an array of JS Date objects that have slots
        return monthlyAvailability
            .filter((block: any) => block.status === 'available' && block.slots.length > 0)
            .map((block: any) => dayjs(block.date).toDate());
    }, [monthlyAvailability]);

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center mb-4 text-gray-800">
                <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <h2 className="font-bold text-xl">
                    {currentMonth.format('MMMM YYYY')}
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))}>
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
        );
    };


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calendar View */}
            <div className="bg-white p-4 rounded-xl shadow-inner">
                {renderHeader()}

                <DayPicker
                    mode="single"
                    selected={selectedDate ? selectedDate.toDate() : undefined}
                    onSelect={handleDaySelect}
                    onMonthChange={(month) => setCurrentMonth(dayjs(month))}
                    disabled={[
                        { before: new Date() }, // Disable past days
                        (day) => !availableDays.some((d: any) => dayjs(d).isSame(day, 'day')), // Disable days with no slots
                    ]}
                    modifiers={{
                        available: availableDays,
                        selected: selectedDate ? selectedDate.toDate() : undefined,
                    }}
                    modifiersClassNames={{
                        available: 'font-semibold bg-green-50 text-green-700 hover:bg-green-100 border border-green-300',
                        selected: 'bg-primary text-white shadow-md'
                    }}
                    className="w-full"

                />
            </div>

            {/* Time Slots for Selected Day */}
            <Card className="shadow-none border-gray-200 bg-gray-50">
                <CardHeader className="p-4 border-b">
                    <CardTitle className="text-md text-slate-700">
                        {selectedDate ? `Slots on ${selectedDate.format('MMM D')}` : 'Select a date'}
                    </CardTitle>
                    <p className='text-xs text-slate-500'>Times shown in {tutorProfileRules.timeZone}</p>
                </CardHeader>
                <CardContent className="p-4 overflow-y-auto max-h-[400px]">
                    {isSlotsLoading ? (
                        <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                    ) : selectedDate && dailyAvailableSlots.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {dailyAvailableSlots.map((slot: any, index: number) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className={cn(
                                        "gap-2 w-full justify-center shadow-md",
                                        selectedSlots.some(s => dayjs(s.startTime).isSame(dayjs(slot.startTime)))
                                            ? "bg-primary text-white hover:bg-primary/90"
                                            : "hover:bg-slate-100"
                                    )}
                                    onClick={() => handleSlotClick(slot)}
                                >
                                    <Clock className="h-4 w-4" />
                                    {/* 🚨 FIX: Use Day.js to parse the UTC string and convert it to the Tutor's TZ */}
                                    {dayjs.utc(slot.startTime).tz(tutorProfileRules.timeZone).format('h:mm A')}
                                </Button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center p-8">
                            <XCircle className="h-10 w-10 text-slate-400 mb-4" />
                            <p className="text-lg font-semibold text-slate-800">Fully Booked / No Availability</p>
                            <p className="text-sm text-slate-500 mt-1">Try another day or month.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}