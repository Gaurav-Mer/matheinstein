/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import { useFieldArray, useWatch, } from "react-hook-form";
import { Clock, ChevronUp, ChevronDown, PlusCircle, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddTutorInput } from "@/lib/schemas/tutorSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);


const daysOfWeek = [
    { name: "monday", label: "Monday" },
    { name: "tuesday", label: "Tuesday" },
    { name: "wednesday", label: "Wednesday" },
    { name: "thursday", label: "Thursday" },
    { name: "friday", label: "Friday" },
    { name: "saturday", label: "Saturday" },
    { name: "sunday", label: "Sunday" },
];

const timeSlots = [
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"
];

const formatTimeToAmPm = (time24: string) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

interface TutorAvailabilityProps {
    control: any;
    initialData?: AddTutorInput['availability'];
}

export default function TutorAvailability({ control, initialData }: TutorAvailabilityProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "availability",
    });

    const availability = useWatch({ control, name: "availability" });

    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        if (initialData) {
            remove();
            initialData.forEach(item => append(item));
        }
    }, [initialData, append, remove]);

    const handleToggleDay = (dayName: string, isChecked: boolean) => {
        if (isChecked) {
            append({ day: dayName, startTime: "09:00", endTime: "17:30", slotDuration: 60 });
        } else {
            const dayIndices = fields
                .map((field: any, index) => (field.day === dayName ? index : -1))
                .filter((index) => index !== -1);
            dayIndices.sort((a, b) => b - a).forEach((index) => remove(index));
        }
    };

    const isDayEnabled = (dayName: string) => {
        return availability?.some((slot: any) => slot.day === dayName) || false;
    };

    const getDaySlots = (dayName: string) => {
        return fields.filter((field: any) => field.day === dayName);
    };

    const findFieldIndex = (dayName: string, id: string) => {
        return fields.findIndex((field: any) => field.day === dayName && field.id === id);
    };

    return (
        <div className="max-w-full w-full border p-4 mx-auto rounded-xl bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <Clock className="h-6 w-6 text-gray-600" />
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Teaching hours</h3>
                        <p className="text-sm text-gray-500">Control when students can book sessions</p>
                    </div>
                </div>
                {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
            </div>

            {isExpanded && (
                <div className="space-y-6 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                        {daysOfWeek.map(({ name, label }) => {
                            const isEnabled = isDayEnabled(name);
                            const daySlots = getDaySlots(name);

                            return (
                                <Card key={name} className="p-4 shadow-sm transition-all duration-300">
                                    <CardHeader className="flex  items-center justify-between p-0 mb-4">
                                        <CardTitle className="text-lg font-semibold">{label}</CardTitle>
                                        <Switch
                                            checked={isEnabled}
                                            onCheckedChange={(checked) => handleToggleDay(name, checked)}
                                        />
                                    </CardHeader>
                                    <CardContent className="p-0 space-y-4">
                                        {isEnabled && daySlots.map((slot: any) => (
                                            <div key={slot.id} className="flex items-center gap-3">
                                                <div className="flex-grow grid grid-cols-2 gap-2">
                                                    <div>
                                                        <Label htmlFor={`start-${slot.id}`} className="sr-only">Start Time</Label>
                                                        <Select
                                                            value={slot.startTime}
                                                            onValueChange={(value) => {
                                                                const index = findFieldIndex(name, slot.id);
                                                                if (index !== -1) {
                                                                    const currentSlot = fields[index];
                                                                    control.setValue(`availability.${index}.startTime`, value);
                                                                }
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-full h-8 text-sm">
                                                                <SelectValue>
                                                                    {formatTimeToAmPm(slot.startTime)}
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {timeSlots.map(time => (
                                                                    <SelectItem key={time} value={time}>
                                                                        {formatTimeToAmPm(time)}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`end-${slot.id}`} className="sr-only">End Time</Label>
                                                        <Select
                                                            value={slot.endTime}
                                                            onValueChange={(value) => {
                                                                const index = findFieldIndex(name, slot.id);
                                                                if (index !== -1) {
                                                                    control.setValue(`availability.${index}.endTime`, value);
                                                                }
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-full h-8 text-sm">
                                                                <SelectValue>
                                                                    {formatTimeToAmPm(slot.endTime)}
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {timeSlots.map(time => (
                                                                    <SelectItem key={time} value={time}>
                                                                        {formatTimeToAmPm(time)}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                {daySlots.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => remove(findFieldIndex(name, slot.id))}
                                                        className="text-red-500 hover:text-red-700 p-1 rounded-full"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        {isEnabled && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => append({ day: name, startTime: "09:00", endTime: "17:30", slotDuration: 60 })}
                                                className="w-full gap-2 text-secondary border-secondary hover:bg-secondary/20 "
                                            >
                                                <PlusCircle className="w-4 h-4" /> Add Slot
                                            </Button>
                                        )}
                                        {!isEnabled && (
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                                </div>
                                                <span className="text-sm">Closed</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}