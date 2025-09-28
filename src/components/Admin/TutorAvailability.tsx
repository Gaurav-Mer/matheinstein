/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import { useFieldArray, useWatch, useFormContext } from "react-hook-form";
import { Clock, ChevronUp, ChevronDown, PlusCircle, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

// --- CONSTANTS & HELPERS ---

const daysOfWeek = [
    { name: "monday", label: "Monday" },
    { name: "tuesday", label: "Tuesday" },
    { name: "wednesday", label: "Wednesday" },
    { name: "thursday", label: "Thursday" },
    { name: "friday", label: "Friday" },
    { name: "saturday", label: "Saturday" },
    { name: "sunday", label: "Sunday" },
];

// Generate time slots every 30 minutes from 6 AM to 10 PM
const timeSlots = Array.from({ length: 36 }, (_, i) => {
    const hour = Math.floor(i / 2) + 6;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

const formatTimeToAmPm = (time24: string) => {
    if (!time24) return "Select time";
    return dayjs(`1970-01-01T${time24}:00`).format('h:mm A');
};

// --- SUB-COMPONENT FOR A SINGLE TIME SLOT ROW ---
// This makes the main component much cleaner and encapsulates the row's logic.
const TimeSlotRow = ({ control, index, remove, fomtState }: any) => {
    // We get the `update` function directly from `useFieldArray` for robust updates.
    const { update, } = useFieldArray({ control, name: "availability" });
    const slot = useWatch({ control, name: `availability.${index}` });
    // Filter end times to only show options after the selected start time.
    const filteredEndTimes = timeSlots.filter(time => time > slot.startTime);
    const handleStartTimeChange = (value: string) => {
        // If the new start time is after the old end time, auto-select the next valid end time.
        const newEndTime = value >= slot.endTime ? timeSlots.find(time => time > value) || '' : slot.endTime;
        update(index, { ...slot, startTime: value, endTime: newEndTime });
    };

    const handleEndTimeChange = (value: string) => {
        update(index, { ...slot, endTime: value });
    };

    return (
        <div className="flex items-center gap-3">
            <div className="flex-grow grid grid-cols-2 gap-2">
                {/* Start Time Select */}
                <Select value={slot.startTime} onValueChange={handleStartTimeChange}>
                    <SelectTrigger className="w-full h-9 text-sm bg-white">
                        <SelectValue placeholder="Start time" />
                    </SelectTrigger>
                    <SelectContent>
                        {timeSlots.slice(0, -1).map(time => ( // Exclude the last time slot
                            <SelectItem key={`start-${time}`} value={time}>
                                {formatTimeToAmPm(time)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {/* End Time Select */}
                <Select value={slot.endTime} onValueChange={handleEndTimeChange} disabled={!slot.startTime}>
                    <SelectTrigger className="w-full h-9 text-sm bg-white">
                        <SelectValue placeholder="End time" />
                    </SelectTrigger>
                    <SelectContent>
                        {filteredEndTimes.map(time => (
                            <SelectItem key={`end-${time}`} value={time}>
                                {formatTimeToAmPm(time)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {/* Remove Button */}
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full"
                aria-label="Remove time slot"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
    );
};


// --- MAIN COMPONENT ---
interface TutorAvailabilityProps {
    control: any;
    // It's better to pass the entire form object to use `reset`
    // but this works for a simple case.
    initialData?: { day: string; startTime: string; endTime: string; }[];
}

export default function TutorAvailability({ control, initialData }: TutorAvailabilityProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "availability",
    });

    const [isExpanded, setIsExpanded] = useState(true);

    // Populate form with initial data on mount
    useEffect(() => {
        if (initialData && fields.length === 0) { // Only populate if fields are empty
            initialData.forEach(item => append(item, { shouldFocus: false }));
        }
    }, [initialData, append, fields.length]);

    const handleToggleDay = (dayName: string, isChecked: boolean) => {
        if (isChecked) {
            // Add a default 9 AM to 5 PM slot when a day is enabled
            append({ day: dayName, startTime: "09:00", endTime: "17:00" });
        } else {
            // Find all indices for the day to be disabled
            const indicesToRemove = fields
                .map((field: any, index) => (field.day === dayName ? index : -1))
                .filter(index => index !== -1);

            // Remove in reverse order to avoid index shifting issues
            indicesToRemove.reverse().forEach(index => remove(index));
        }
    };

    const isDayEnabled = (dayName: string) => {
        return fields.some((field: any) => field.day === dayName);
    };

    return (
        <Card className="max-w-full w-full mx-auto shadow-sm">
            <CardHeader
                className="flex flex-row items-center justify-between cursor-pointer p-4"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <Clock className="h-6 w-6 text-primary" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Teaching hours</h3>
                        <p className="text-sm text-gray-500">Define your weekly recurring availability.</p>
                    </div>
                </div>
                {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
            </CardHeader>

            {isExpanded && (
                <CardContent className="p-4 pt-0">
                    <div className="space-y-4">
                        {daysOfWeek.map(({ name, label }) => {
                            const isEnabled = isDayEnabled(name);
                            // Get the indices of the fields for this day
                            const dayFieldIndices = fields
                                .map((field: any, index: number) => field.day === name ? index : -1)
                                .filter(index => index !== -1);

                            return (
                                <div key={name} className="p-4 border rounded-lg bg-gray-50/50 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <Label htmlFor={`switch-${name}`} className={cn("text-md font-medium transition-colors", isEnabled ? "text-slate-800" : "text-slate-400")}>{label}</Label>
                                        <Switch
                                            id={`switch-${name}`}
                                            checked={isEnabled}
                                            onCheckedChange={(checked) => handleToggleDay(name, checked)}
                                        />
                                    </div>
                                    {isEnabled && (
                                        <div className="space-y-3 animate-in fade-in-0 duration-300">
                                            {dayFieldIndices.map(index => (
                                                <TimeSlotRow
                                                    key={(fields[index] as any).id}
                                                    control={control}
                                                    index={index}
                                                    remove={remove}
                                                />
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => append({ day: name, startTime: "09:00", endTime: "17:00" })}
                                                className="w-full gap-2 text-primary border-primary hover:bg-primary/10"
                                            >
                                                <PlusCircle className="w-4 h-4" /> Add Interval
                                            </Button>
                                        </div>
                                    )}
                                    {!isEnabled && (
                                        <p className="text-sm text-slate-400">Unavailable</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}