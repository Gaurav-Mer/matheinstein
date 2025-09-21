/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useFormContext } from "react-hook-form";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AddTutorInput } from "@/lib/schemas/tutorSchema";
import { defaultTimeZone, timeZones } from '@/lib/timezone';

export default function TutorBookingSettings() {
    const { register, watch, setValue, formState: { errors } } = useFormContext<AddTutorInput>();
    const [isExpanded, setIsExpanded] = useState(true);

    // Watch values from the form state, using a default if not set
    const watchedValues = {
        timeZone: watch("timeZone") || defaultTimeZone,
        bufferTime: watch("bufferTime") || 15,
        sessionDurationMin: watch("sessionDuration.min") || 30,
        sessionDurationMax: watch("sessionDuration.max") || 60,
        bookingWindowMin: watch("bookingWindow.minAdvanceNotice") || 24,
        bookingWindowMax: watch("bookingWindow.maxAdvanceNotice") || 30,
    };

    return (
        <Card className="max-w-full w-full border p-4 mx-auto rounded-xl bg-white shadow-sm">
            {/* Header */}
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <Clock className="h-6 w-6 text-gray-600" />
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Booking & Availability Settings</h3>
                        <p className="text-sm text-gray-500">Customize how and when students can book lessons</p>
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
                    {/* Time Zone */}
                    <div className="space-y-3">
                        <Label htmlFor="timeZone" className="text-base font-medium text-gray-900">Time Zone</Label>
                        <Select
                            value={watchedValues.timeZone}
                            onValueChange={(value) => setValue("timeZone", value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a time zone" />
                            </SelectTrigger>
                            <SelectContent>
                                {timeZones.map((zone) => (
                                    <SelectItem key={zone.value} value={zone.value}>
                                        {zone.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.timeZone && <p className="text-sm text-red-500">{errors.timeZone.message}</p>}
                    </div>

                    {/* Buffer Time */}
                    <div className="space-y-3">
                        <Label htmlFor="bufferTime" className="text-base font-medium text-gray-900">Buffer Time</Label>
                        <div className="flex items-center gap-3">
                            <Input
                                id="bufferTime"
                                type="number"
                                placeholder={watchedValues.bufferTime.toString()}
                                {...register("bufferTime", { valueAsNumber: true })}
                                className={cn("w-20 text-center", errors.bufferTime && "border-red-500")}
                                min="0"
                                max="120"
                            />
                            <span className="text-sm text-gray-600">minutes between sessions</span>
                        </div>
                        {errors.bufferTime && <p className="text-sm text-red-500">{errors.bufferTime.message}</p>}
                    </div>

                    {/* Session Duration */}
                    <div className="space-y-3">
                        <Label className="text-base font-medium text-gray-900">Session Duration</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="minDuration" className="text-sm text-gray-500">Minimum (min)</Label>
                                <Input
                                    id="minDuration"
                                    type="number"
                                    placeholder={watchedValues.sessionDurationMin.toString()}
                                    {...register("sessionDuration.min", { valueAsNumber: true })}
                                    className={cn(errors.sessionDuration?.min && "border-red-500")}
                                    min="15"
                                />
                                {errors.sessionDuration?.min && <p className="text-sm text-red-500 mt-1">{errors.sessionDuration.min.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="maxDuration" className="text-sm text-gray-500">Maximum (min)</Label>
                                <Input
                                    id="maxDuration"
                                    type="number"
                                    placeholder={watchedValues.sessionDurationMax.toString()}
                                    {...register("sessionDuration.max", { valueAsNumber: true })}
                                    className={cn(errors.sessionDuration?.max && "border-red-500")}
                                    min="30"
                                />
                                {errors.sessionDuration?.max && <p className="text-sm text-red-500 mt-1">{errors.sessionDuration.max.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Booking Window */}
                    <div className="space-y-3">
                        <Label className="text-base font-medium text-gray-900">Booking Window</Label>
                        <p className="text-sm text-gray-500">How far in advance can students book lessons?</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="minNotice" className="text-sm text-gray-500">Min. Advance Notice (hours)</Label>
                                <Input
                                    id="minNotice"
                                    type="number"
                                    placeholder={watchedValues.bookingWindowMin.toString()}
                                    {...register("bookingWindow.minAdvanceNotice", { valueAsNumber: true })}
                                    className={cn(errors.bookingWindow?.minAdvanceNotice && "border-red-500")}
                                    min="1"
                                />
                                {errors.bookingWindow?.minAdvanceNotice && <p className="text-sm text-red-500 mt-1">{errors.bookingWindow.minAdvanceNotice.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="maxNotice" className="text-sm text-gray-500">Max. Advance Notice (days)</Label>
                                <Input
                                    id="maxNotice"
                                    type="number"
                                    placeholder={watchedValues.bookingWindowMax.toString()}
                                    {...register("bookingWindow.maxAdvanceNotice", { valueAsNumber: true })}
                                    className={cn(errors.bookingWindow?.maxAdvanceNotice && "border-red-500")}
                                    min="7"
                                />
                                {errors.bookingWindow?.maxAdvanceNotice && <p className="text-sm text-red-500 mt-1">{errors.bookingWindow.maxAdvanceNotice.message}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}