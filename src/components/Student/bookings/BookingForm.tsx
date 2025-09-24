/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from 'react';
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, CreditCard, ShoppingCart, DollarSign, XCircle } from "lucide-react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useCreateBooking } from "@/hooks/bookings/useCreateBookings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'react-toastify';

dayjs.extend(utc);
dayjs.extend(timezone);

const formSchema = z.object({
    subject: z.string().min(1, "Session subject is required."),
});

type FormInput = z.infer<typeof formSchema>;

interface BookingFormProps {
    tutor: any;
    selectedSlots: any[];
    onClose: () => void;
}

// Helper to display currency (since we are not implementing the API yet, this is for UI fidelity)
const currencyDisplay = (amount: number, currency: string = 'USD') => {
    const symbol = currency === 'INR' ? '₹' : '$';
    return `${symbol}${amount.toFixed(2)}`;
};

export default function BookingForm({ tutor, selectedSlots, onClose }: BookingFormProps) {
    const { user, lessonCredits } = useAuth();
    const { mutate: createBooking, isPending } = useCreateBooking();

    // ⚠️ We assume the user's lessonCredits are part of the user object from useAuth
    // NEW: Correct access from the hook's returned profile/credits
    const userCredits = lessonCredits || 0;
    const requiredCredits = selectedSlots.length;
    const hasEnoughCredits = userCredits >= requiredCredits;

    const methods = useForm<FormInput>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit: SubmitHandler<FormInput> = (data) => {
        if (!hasEnoughCredits) {
            toast.error("Insufficient credits. Please buy a package.");
            onClose();
            return;
        }

        const bookingsData: any = selectedSlots.map(slot => ({
            tutorId: tutor.uid,
            studentId: user?.uid ?? "",
            subject: data.subject,
            startTime: dayjs(slot.startTime).utc().toISOString(),
            endTime: dayjs(slot.endTime).add(60, 'minute').utc().toISOString(),
            timeZone: tutor.timeZone,
            // Price/credit logic is handled on the backend based on the purchase record
        }));

        createBooking(bookingsData, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    // The price is calculated based on the first package defined by the tutor (for display only)
    const pricePerSlot = tutor.paidLessons?.[0]?.price || 50;
    const totalCostDisplay = pricePerSlot * requiredCredits;


    // --- State 1: Insufficient Credits UI ---
    if (!hasEnoughCredits) {
        return (
            <Card className="shadow-none border-red-200">
                <CardHeader className="text-center">
                    <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                    <DialogTitle className="text-xl font-bold text-slate-800">
                        Insufficient Credits
                    </DialogTitle>
                    <DialogDescription className="text-md text-slate-600">
                        You need **{requiredCredits}** credits but only have **{userCredits}** available.
                    </DialogDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-center text-sm text-slate-500">
                        Please purchase a lesson package to complete this booking.
                    </p>
                    <DialogFooter className="flex-col gap-3">
                        <Link href={`/student/packages/${tutor.uid}`} className="w-full">
                            <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                                <ShoppingCart className="h-4 w-4" />
                                Buy Lessons Now
                            </Button>
                        </Link>
                        <Button onClick={onClose} variant="outline" className="w-full">
                            Cancel Booking
                        </Button>
                    </DialogFooter>
                </CardContent>
            </Card>
        );
    }

    // --- State 2: Confirmation UI (Ready to Book) ---
    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-800">
                        Confirm & Use Credits
                    </DialogTitle>
                    <DialogDescription>
                        You are about to book {requiredCredits} session(s) with {tutor.name}.
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

                    {/* Selected Slots Summary */}
                    <h4 className="text-md font-semibold text-slate-700">Selected Slots ({requiredCredits})</h4>
                    <ul className="max-h-32 overflow-y-auto space-y-2 border p-2 rounded-md">
                        {selectedSlots.map((slot, index) => (
                            <li key={index} className="flex items-center justify-between text-sm p-2 rounded-md bg-slate-50">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-slate-500" />
                                    {dayjs(slot.startTime).tz(tutor.timeZone).format('ddd, MMM D')}
                                </div>
                                <Badge variant="secondary">
                                    {dayjs(slot.startTime).tz(tutor.timeZone).format('h:mm A')}
                                </Badge>
                            </li>
                        ))}
                    </ul>
                </div>
                <DialogFooter>
                    <div className="flex justify-between w-full items-center">
                        <div className="flex items-center gap-2 text-lg font-bold text-primary">
                            <CreditCard className="h-5 w-5" />
                            {requiredCredits} Credits
                        </div>
                        <Button type="submit" className="gap-2" disabled={isPending}>
                            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                            Book Sessions
                        </Button>
                    </div>
                </DialogFooter>
            </form>
        </FormProvider>
    );
}