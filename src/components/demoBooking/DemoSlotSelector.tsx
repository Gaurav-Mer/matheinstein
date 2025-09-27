/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { DayPicker, Matcher } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { cn } from '@/lib/utils';
import { Loader2, CalendarDays } from 'lucide-react';
import { usePublicDemoSlots } from '@/hooks/usePublicDemoSlots';

// It's a good practice to load the necessary dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// --- Define Types for better code safety ---
interface Slot {
    start_time: string;
    end_time: string;
    status: 'available';
    invitees_remaining: number;
}

interface DayAvailability {
    date: string; // "YYYY-MM-DD"
    status: 'available' | 'booked_solid' | 'unavailable' | 'past';
    slots: Slot[];
}

interface AvailabilityResponse {
    availability: DayAvailability[];
    meta: {
        timezone: string;
        duration_minutes: number;
        interval_minutes: number;
    };
}

interface DemoSlotSelectorProps {
    selectedAdmin: { uid: string; name: string; timeZone: string };
    subjectName: string;
}

export default function DemoSlotSelector({ selectedAdmin, subjectName }: DemoSlotSelectorProps) {
    const { setValue, watch } = useFormContext();

    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);

    const demoSlotsQuery = useMemo(() => ({
        userId: selectedAdmin.uid,
        startDate: dayjs(calendarMonth).startOf('month').toISOString(),
        endDate: dayjs(calendarMonth).endOf('month').toISOString(),
    }), [selectedAdmin.uid, calendarMonth]);

    const { data: adminData, isLoading: isSlotsLoading } = usePublicDemoSlots(demoSlotsQuery) as { data?: AvailabilityResponse; isLoading: boolean };

    // Create an efficient Map for instant lookups (Date String -> DayAvailability)
    const availabilityMap = useMemo(() => {
        if (!adminData?.availability) return new Map<string, DayAvailability>();

        return new Map(
            adminData.availability.map(day => [day.date, day])
        );
    }, [adminData]);

    // Determine which days to disable in the calendar based on the API response
    const disabledDays: Matcher[] = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of today for accurate comparison

        const disabledMatchers: Matcher[] = [{ before: today }];

        if (adminData?.availability) {
            adminData.availability.forEach(day => {
                // Disable if the status is not 'available'
                if (day.status !== 'available') {
                    disabledMatchers.push(new Date(day.date + 'T00:00:00')); // Use T00:00:00 to avoid timezone issues
                }
            });
        }
        return disabledMatchers;
    }, [adminData]);

    // Get the slots for the currently selected day using the efficient map lookup
    const dailySlots = useMemo(() => {
        if (!selectedDay || !availabilityMap) return [];

        const selectedDateString = dayjs(selectedDay).format('YYYY-MM-DD');
        const dayData = availabilityMap.get(selectedDateString);

        if (!dayData || dayData.status !== 'available') return [];

        return dayData.slots.map(slot => ({
            label: dayjs(slot.start_time).tz(selectedAdmin.timeZone).format('h:mm A'),
            value: slot.start_time, // Keep the full ISO string for the form value
        }));
    }, [selectedDay, availabilityMap, selectedAdmin.timeZone]);


    const handleDaySelect = (date: Date | undefined) => {
        if (date) {
            setSelectedDay(date);
            setValue('selectedSlot', '', { shouldValidate: true });
        }
    };

    const handleSlotSelect = (slotValue: string) => {
        setValue('selectedSlot', slotValue, { shouldValidate: true });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" /> 2. Select a Time Slot
            </h3>
            <p className="text-sm text-slate-600 mb-6">
                Your demo for **{subjectName}** will be managed by **{selectedAdmin.name}**. All times are shown in your local timezone.
            </p>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Left: Date Picker */}
                <div className="flex-1 flex justify-center">
                    <DayPicker
                        mode="single"
                        selected={selectedDay}
                        onSelect={handleDaySelect}
                        month={calendarMonth}
                        onMonthChange={setCalendarMonth}
                        disabled={disabledDays}
                        className="w-full border p-4 rounded-xl bg-white shadow-sm"
                        styles={{
                            day: { transition: 'all 0.2s' },
                            head_cell: { fontWeight: 600 },
                        }}
                    />
                </div>
                {/* Right: Slots List */}
                <div className="flex-1 md:border-l md:pl-8">
                    <h3 className="text-lg font-semibold mb-4 text-center md:text-left">
                        {selectedDay ? `Available slots for ${dayjs(selectedDay).format('dddd, MMM D')}` : 'Please select a day'}
                    </h3>
                    {isSlotsLoading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : selectedDay ? (
                        dailySlots.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                {dailySlots.map(slot => (
                                    <button
                                        key={slot.value}
                                        type="button"
                                        onClick={() => handleSlotSelect(slot.value)}
                                        className={cn(
                                            "p-3 border rounded-lg transition-all duration-200 text-center font-semibold",
                                            watch('selectedSlot') === slot.value
                                                ? "border-primary bg-primary text-white shadow-lg"
                                                : "border-gray-300 bg-white hover:border-primary"
                                        )}
                                    >
                                        {slot.label}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg">
                                <p>No available slots for this day.</p>
                            </div>
                        )
                    ) : (
                        <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg">
                            <p>Select a date to see available times.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}