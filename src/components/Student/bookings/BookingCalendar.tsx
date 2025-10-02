/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useMemo } from 'react';
import {
    Clock, Loader2
} from "lucide-react";
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { useTutorAvailableSlots } from '@/hooks/useTutorAvailableSlots';
import { DayPicker, Matcher } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // Ensure CSS is imported
import { NoData } from '@/components/svgs/others';
import { twMerge } from 'tailwind-merge';

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

    const currentDateSlots = useMemo(() => {
        const currDate = selectedDate?.format("YYYY-MM-DD");
        if (!currDate) return []
        const currSlots = monthlyAvailability?.find((it: any) => it.date === currDate)?.slots ?? []
        console.log("currSlots", currSlots, monthlyAvailability)
        return currSlots ?? []
    }, [selectedDate])

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


    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Calendar View */}
            <div className="bg-white lg:col-span-2">
                <DayPicker
                    mode="single"
                    selected={selectedDate ? selectedDate.toDate() : undefined}
                    onSelect={handleDaySelect}
                    onMonthChange={(month) => {
                        setCurrentMonth(dayjs(month))
                        setSelectedDate(null)
                        onSlotSelect([])
                    }}
                    disabled={[
                        { before: new Date() }, // Disable past days
                        (day) => !availableDays.some((d: any) => dayjs(d).isSame(day, "day")), // Disable days with no slots
                    ]}
                    modifiers={{
                        available: availableDays,
                        selected: selectedDate ? selectedDate.toDate() : undefined,
                    }}
                    modifiersClassNames={{
                        available: "font-medium text-primary",
                        selected:
                            "bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center hover:bg-primary/90 focus:ring-2 focus:ring-primary mx-auto",
                    }}
                    className="!w-full flex justify-center"
                    classNames={{
                        chevron: "fill-secondary",
                        today: "text-primary",
                        months: "w-full",
                        month_grid: "w-full",
                        month: "w-full",
                        day_button: "w-full h-12"
                    }}
                    navLayout="around"
                />

            </div>

            {/* Time Slots for Selected Day */}
            <div className="shadow-none  border-l lg:col-span-3">
                <CardContent className={twMerge("overflow-y-auto max-h-[400px]", !selectedSlots?.length && "h-full justify-center items-center ")}>
                    {isSlotsLoading ? (
                        <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                    ) : selectedDate && currentDateSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-4">
                            {currentDateSlots.map((slot: any, index: number) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className={cn(
                                        "gap-2 w-full justify-center rounded-xl transition-all duration-200 border-2",
                                        selectedSlots.some(s => dayjs(s.startTime).isSame(dayjs(slot.startTime)))
                                            ? "bg-primary text-white border-primary hover:bg-primary/90 hover:border-primary/90"
                                            : "border text-black hover:border-primary hover:bg-primary/5 hover:text-primary"
                                    )}
                                    onClick={() => handleSlotClick(slot)}
                                    size={"lg"}
                                >
                                    <Clock className="h-4 w-4" />
                                    {dayjs.utc(slot.startTime).tz(tutorProfileRules.timeZone).format('h:mm A')}
                                </Button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center h-full">
                            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                                <NoData className='scale-125' />
                            </div>
                            <p className="text-lg font-semibold text-primary mb-2">No available times</p>
                            <p className="text-sm text-black">Please select another date to see available slots.</p>
                        </div>
                    )}
                </CardContent>
            </div>
        </div>
    );
}