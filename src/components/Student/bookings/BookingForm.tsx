/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, CreditCard, X, ChevronRight, ChevronLeft, Package } from "lucide-react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useCreateBooking } from "@/hooks/bookings/useCreateBookings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup } from '@radix-ui/react-radio-group';
import { RadioGroupItem } from '@/components/ui/radio-group';

dayjs.extend(utc);
dayjs.extend(timezone);

const formSchema = z.object({
    subject: z.string().min(1, "Subject is required."),
    // Add other fields like duration, notes, etc.
});

type FormInput = z.infer<typeof formSchema>;

interface BookingFormProps {
    tutor: any;
    selectedSlots: any[];
    onClose: () => void;
    isPackageBooking: boolean;
}

export default function BookingForm({ tutor, selectedSlots, onClose, isPackageBooking }: BookingFormProps) {
    const { user } = useAuth();
    const { mutate: createBooking, isPending } = useCreateBooking();
    const [step, setStep] = useState(isPackageBooking ? 1 : 2);
    const [selectedPackage, setSelectedPackage] = useState<any>(null);

    const methods = useForm<FormInput>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit: SubmitHandler<FormInput> = (data) => {
        // Prepare data for all selected slots
        const bookingsData: any = selectedSlots.map(slot => ({
            tutorId: tutor.uid,
            studentId: user?.uid ?? "",
            subject: data.subject,
            startTime: dayjs(slot.startTime).utc().toISOString(),
            endTime: dayjs(slot.endTime).add(60, 'minute').utc().toISOString(),
            timeZone: tutor.timeZone, // Pass the tutor's time zone
        }));

        // This mutation will need to be updated to handle multiple bookings
        createBooking(bookingsData, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    // --- Step 1: Package Selection ---
    const renderPackageSelection = () => (
        <Dialog>
            <DialogHeader>
                <DialogTitle>Select a Booking Package</DialogTitle>
                <DialogDescription>
                    You have selected {selectedSlots.length} sessions.
                </DialogDescription>
            </DialogHeader>
            <RadioGroup onValueChange={(value: any) => setSelectedPackage(JSON.parse(value))} className="py-4 space-y-4">
                {tutor.paidLessons.map((lesson: any, index: number) => (
                    <Card
                        key={index}
                        className={cn("cursor-pointer", selectedPackage?.duration === lesson.duration && "border-primary ring-2 ring-primary")}
                        onClick={() => setSelectedPackage(lesson)}
                    >
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Package className="h-6 w-6 text-primary" />
                                <div>
                                    <h3 className="font-bold">{lesson.duration} Minute Session</h3>
                                    <p className="text-sm text-muted-foreground">${lesson.price.toFixed(2)} per session</p>
                                </div>
                            </div>
                            <RadioGroupItem value={JSON.stringify(lesson)} id={`package-${index}`} />
                        </CardContent>
                    </Card>
                ))}
            </RadioGroup>
            <DialogFooter>
                <Button onClick={onClose} variant="outline">Cancel</Button>
                <Button onClick={() => setStep(2)} disabled={selectedSlots.length === 0}>
                    Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            </DialogFooter>
        </Dialog>
    );


    // --- Step 2: Slot Confirmation ---
    const renderSlotConfirmation = () => (
        <Dialog>
            <DialogHeader>
                <DialogTitle>Confirm Your Sessions</DialogTitle>
                <DialogDescription>
                    You have selected {selectedSlots.length} sessions.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="subject">Session Subject</Label>
                    <Input
                        id="subject"
                        placeholder="e.g., Algebra I"
                        {...methods.register("subject")}
                        className="mt-1"
                    />
                    {methods.formState.errors.subject && <p className="text-sm text-red-500 mt-1">{methods.formState.errors.subject.message}</p>}
                </div>
                <ul className="max-h-40 overflow-y-auto space-y-2">
                    {selectedSlots.map((slot, index) => (
                        <li key={index} className="flex items-center justify-between text-sm p-2 rounded-md bg-slate-50">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-slate-500" />
                                {dayjs(slot.startTime).tz(tutor.timeZone).format('PPP')}
                            </div>
                            <Badge variant="outline">
                                {dayjs(slot.startTime).tz(tutor.timeZone).format('p')}
                            </Badge>
                        </li>
                    ))}
                </ul>
            </div>
            <DialogFooter>
                <Button onClick={() => setStep(isPackageBooking ? 1 : 2)} variant="outline">
                    <ChevronLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button type="submit" className="gap-2" disabled={isPending}>
                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    <CreditCard className="h-4 w-4" />
                    Pay and Book Now
                </Button>
            </DialogFooter>
        </Dialog>
    );

    return (
        <form onSubmit={methods.handleSubmit(onSubmit)}>
            {step === 1 && renderPackageSelection()}
            {step === 2 && renderSlotConfirmation()}
        </form>
    );
}