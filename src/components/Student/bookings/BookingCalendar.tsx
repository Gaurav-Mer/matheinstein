/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import {
    ChevronLeft, ChevronRight,
    CalendarDays, Clock, CheckCircle, XCircle, Plus,
    Loader2
} from "lucide-react";
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { useTutorBookedSlots } from '@/hooks/tutors/useTutorBookedSlots';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// Helper function to generate time slots based on tutor's rules
const generateTimeSlots = (date: dayjs.Dayjs, availability: any[], timeZone: string) => {
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

// Helper function to filter out booked and past slots
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

    const { data: bookedSlots = [], isLoading: isBookedSlotsLoading } = useTutorBookedSlots(
        tutor?.uid,
        currentMonth.toISOString()
    );

    const handleSlotClick = (slot: any) => {
        const isSelected = selectedSlots.some(s => dayjs(s.startTime).isSame(dayjs(slot.startTime)));
        if (isSelected) {
            onSlotSelect(selectedSlots.filter(s => !dayjs(s.startTime).isSame(dayjs(slot.startTime))));
        } else {
            onSlotSelect([...selectedSlots, slot]);
        }
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center mb-4">
                <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <h2 className="font-semibold text-xl">
                    {currentMonth.format('MMMM YYYY')}
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))}>
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const date = dayjs().month(currentMonth.month()).startOf('week');

        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={i} className="text-sm font-medium text-slate-500 text-center">
                    {date.add(i, 'day').format('dd')}
                </div>
            );
        }
        return <div className="grid grid-cols-7 gap-2">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = currentMonth.startOf('month').startOf('week');
        const monthEnd = currentMonth.endOf('month').endOf('week');
        const rows = [];
        let day = monthStart;

        while (day.isSameOrBefore(monthEnd)) {
            const cells = [];
            for (let i = 0; i < 7; i++) {
                const isCurrentMonth = day.month() === currentMonth.month();
                const isSelected = selectedDate && day.isSame(selectedDate, 'day');
                const isToday = day.isSame(dayjs(), 'day');
                const isPastDay = day.isBefore(dayjs(), 'day');
                const hasSlots = getAvailableTimeSlots(day, tutor.availability, tutor.timeZone, bookedSlots).length > 0;

                cells.push(
                    <div
                        key={day.format('YYYY-MM-DD')}
                        className={cn(
                            "p-2 text-center rounded-lg cursor-pointer transition-colors duration-200",
                            !isCurrentMonth ? "text-slate-300" : "text-slate-800",
                            isToday && "ring-2 ring-primary ring-offset-2",
                            isSelected ? "bg-primary text-white" : "hover:bg-slate-100",
                            (isPastDay || !hasSlots) && "cursor-not-allowed opacity-50"
                        )}
                        onClick={() => {
                            if (!isPastDay && hasSlots) {
                                setSelectedDate(day);
                            }
                        }}
                    >
                        {day.format('D')}
                    </div>
                );
                day = day.add(1, 'day');
            }
            rows.push(<div key={day.format('YYYY-MM-DD')} className="grid grid-cols-7 gap-2">{cells}</div>);
        }
        return rows;
    };

    const availableSlots = selectedDate ? getAvailableTimeSlots(selectedDate, tutor.availability, tutor.timeZone, bookedSlots) : [];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calendar View */}
            <div>
                {renderHeader()}
                {renderDays()}
                <div className="space-y-2 mt-2">
                    {isBookedSlotsLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        renderCells()
                    )}
                </div>
            </div>

            {/* Time Slots for Selected Day */}
            <Card className="shadow-none border-gray-200 bg-gray-50">
                <CardHeader>
                    <CardTitle className="text-lg">
                        {selectedDate ? selectedDate.format('ddd, MMM D') : 'Select a day'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {selectedDate && availableSlots.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {availableSlots.map((slot: any, index: number) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className={cn("gap-2", selectedSlots.some(s => dayjs(s.startTime).isSame(dayjs(slot.startTime))) && "bg-primary text-white hover:bg-primary")}
                                    onClick={() => handleSlotClick(slot)}
                                >
                                    <Clock className="h-4 w-4" />
                                    {dayjs(slot.startTime).tz(tutor.timeZone).format('h:mm A')}
                                </Button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center p-8">
                            <XCircle className="h-10 w-10 text-slate-400 mb-4" />
                            <p className="text-lg font-semibold text-slate-800">No slots available</p>
                            <p className="text-sm text-slate-500 mt-1">Try another day or month.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}