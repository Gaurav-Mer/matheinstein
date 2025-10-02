/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from 'react';
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"; // Keep for DialogFooter reference
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, CreditCard, ShoppingCart, BookOpen, XCircle } from "lucide-react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useCreateBooking } from '@/hooks/bookings/useCreateBookings';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/useAuth';
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"; // Added CardFooter
import { usePublicSubjects } from '@/hooks/usePublicSubjects';
import { toast } from 'react-toastify';

dayjs.extend(utc);
dayjs.extend(timezone);

const formSchema = z.object({
    subject: z.string().optional(),
});

type FormInput = z.infer<typeof formSchema>;

interface BookingFormProps {
    tutor: any;
    selectedSlots: any[];
    onClose: () => void;
}

export default function BookingForm({ tutor, selectedSlots, onClose }: BookingFormProps) {
    console.log("selectedSlots,", selectedSlots)
    const { user, lessonCredits, profile } = useAuth();
    const { mutate: createBooking, isPending } = useCreateBooking();
    const { data: subjects } = usePublicSubjects(); // Fetch subjects to get name from ID
    const userCredits = lessonCredits || 0;
    const requiredCredits = selectedSlots.length;
    const hasEnoughCredits = userCredits >= requiredCredits;

    const subjectId = selectedSlots[0]?.subjectId;
    const subjectName = useMemo(() => {
        return subjects?.find((sub: any) => sub.id === subjectId)?.name || 'Not Found';
    }, [subjects, subjectId]);


    const methods = useForm<FormInput>({
        resolver: zodResolver(formSchema),
        defaultValues: { subject: subjectName || '' },
    });

    const onSubmit: SubmitHandler<FormInput> = (data) => {
        if (!hasEnoughCredits) {
            toast.error("Insufficient credits. Please buy a package.");
            onClose();
            return;
        }

        const bookingsData: any = selectedSlots.map((slot) => ({
            tutorId: tutor.uid,
            studentId: user?.uid ?? "",
            subject: profile?.subjects?.[0], // Use the fetched subjectName
            startTime: dayjs(slot.startTime).utc().toISOString(),
            endTime: dayjs(slot.startTime).add(60, "minute").utc().toISOString(),
            timeZone: tutor.timeZone,
        }));

        createBooking(bookingsData, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    // --- State 1: Insufficient Credits UI ---
    if (!hasEnoughCredits) {
        return (
            <Card className="bg-gradient-to-br from-red-50 to-white border border-red-200 rounded-3xl shadow-lg overflow-hidden">
                <CardHeader className="text-center space-y-3 p-6">
                    <XCircle className="h-14 w-14 text-red-500 mx-auto drop-shadow-sm" />
                    <h2 className="text-2xl font-bold text-red-700">Not Enough Credits</h2>
                    <p className="text-base text-slate-600">
                        You need <span className="font-semibold text-slate-900">{requiredCredits}</span> credits but only have <span className="font-semibold text-slate-900">{userCredits}</span>.
                    </p>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    <p className="text-center text-sm text-slate-500">
                        Upgrade your package to continue booking with <span className="font-semibold">{tutor.name}</span>.
                    </p>
                    <DialogFooter className="flex-col gap-3">
                        <Link href={`/student/packages/${tutor.uid}`} className="w-full">
                            <Button className="w-full gap-2 rounded-full bg-primary hover:bg-primary/90 h-12 text-base shadow-md transition-transform hover:scale-[1.02]">
                                <ShoppingCart className="h-5 w-5" />
                                Buy Lesson Package
                            </Button>
                        </Link>
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="w-full rounded-full h-12 text-base"
                        >
                            Cancel
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
                <Card className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-xl overflow-hidden">
                    <CardHeader className="space-y-3 text-center p-6 border-b">
                        {/* 🚨 FIX: Remove Dialog components and use standard Card/Header */}
                        <h2 className="text-2xl font-bold text-slate-900">Confirm Your Booking</h2>
                        <p className="text-slate-600 text-base">
                            You’re booking{" "}
                            <span className="font-semibold">{requiredCredits}</span> session
                            {requiredCredits > 1 ? "s" : ""} with{" "}
                            <span className="font-semibold text-primary">{tutor.name}</span>
                            .
                        </p>
                    </CardHeader>

                    <CardContent className="p-6 space-y-6">
                        {/* Subject Display (Read-Only) */}
                        <div className="space-y-2 text-left">
                            <Label htmlFor="subject" className="text-slate-700 font-medium flex items-center gap-2">
                                <BookOpen className='w-4 h-4 text-slate-500' /> Session Subject
                            </Label>
                            <Input
                                id="subject"
                                value={subjectName} // Display the determined subject name
                                readOnly // Set as read-only
                                className="rounded-xl border-slate-200 bg-gray-50 cursor-default transition-all"
                            />
                        </div>

                        {/* Selected Slots Summary */}
                        <div>
                            <h4 className="text-md font-semibold text-slate-800 mb-3">
                                Your Selected Times ({requiredCredits})
                            </h4>
                            <ul className="max-h-36 overflow-y-auto space-y-2 pr-1">
                                {selectedSlots.map((slot, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center justify-between text-sm px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm transition-shadow"
                                    >
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <Calendar className="h-4 w-4 text-slate-500" />
                                            {dayjs(slot.startTime).tz(tutor.timeZone).format("ddd, MMM D")}
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className="rounded-full text-slate-700 bg-white shadow-inner px-3 py-1"
                                        >
                                            {dayjs(slot.startTime).tz(tutor.timeZone).format("h:mm A")}
                                        </Badge>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>

                    {/* Footer */}
                    <DialogFooter className="p-6 bg-slate-50/60 backdrop-blur-md border-t flex justify-between items-center">
                        <div className="flex items-center gap-2 text-lg font-bold text-primary">
                            <CreditCard className="h-5 w-5" />
                            {requiredCredits} Credits
                        </div>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="gap-2 rounded-full px-6 h-12 bg-primary hover:bg-primary/90 text-base shadow-md transition-transform hover:scale-[1.02]"
                        >
                            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                            Confirm & Book
                        </Button>
                    </DialogFooter>
                </Card>
            </form>
        </FormProvider>
    );
}