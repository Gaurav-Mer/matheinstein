/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePublicTutor } from "@/hooks/usePublicTutor";
import { useAuth } from '@/hooks/useAuth'; // We need the user's credit balance
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TutorSummaryCard from './TutorSummaryCard';
import BookingCalendar from './BookingCalendar';
import BookingConfirmationPage from './BookingConfirmationPage';
import { toast } from 'react-toastify';

export default function TutorBookingPage() {
    const params = useParams();
    const router = useRouter();
    const { user, lessonCredits } = useAuth(); // Assume lessonCredits is available via useAuth
    const tutorId = params?.id as string;

    const { data: tutor, isLoading, error } = usePublicTutor(tutorId);
    const [selectedSlots, setSelectedSlots] = useState<any[]>([]);
    const [step, setStep] = useState(1); // 1: Calendar, 2: Confirmation

    const isPackageBooking = (tutor?.paidLessons?.length ?? 0) > 0;

    // Logic to handle slot selection (same as before)
    const handleSlotSelection = (slots: any[]) => {
        setSelectedSlots(slots);
    };

    // New Function: Final check before moving to confirmation
    const handleNextStep = () => {
        if (!user) {
            toast.error("Please log in to book a session.");
            router.push('/auth/login');
            return;
        }

        // 🚨 CRITICAL LOGIC: Check credits for the number of selected slots
        if (lessonCredits < selectedSlots.length) {
            // Redirect to the dedicated checkout page if credits are insufficient
            router.push(`/student/checkout/${tutorId}`);
            return;
        }

        // If credits are sufficient, move to confirmation step (Step 2)
        setStep(2);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
            </div>
        );
    }

    if (error || !tutor) {
        return <p className="text-center text-red-500 mt-20">Tutor not found or an error occurred.</p>;
    }

    return (
        <div className="p-6 md:p-10 min-h-screen bg-gray-50">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/student/dashboard" passHref>
                    <Button variant="outline" size="icon" className="h-10 w-10">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{tutor?.name}</h1>
                    <p className="text-gray-500 text-sm">Booking calendar</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <TutorSummaryCard tutor={tutor} />
                </div>

                <Card className="lg:col-span-2 shadow-md rounded-xl">
                    <CardContent className="p-6">
                        {step === 1 && (
                            <>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    {lessonCredits > 0 ? `Select Your Slots (${lessonCredits} Credits Left)` : 'Select Slot (Buy Package Required)'}
                                </h2>
                                <BookingCalendar
                                    tutor={tutor}
                                    onSlotSelect={handleSlotSelection}
                                    selectedSlots={selectedSlots}
                                />
                                {selectedSlots.length > 0 && (
                                    <div className="flex justify-end mt-6">
                                        <Button onClick={handleNextStep} className="gap-2">
                                            {lessonCredits < selectedSlots.length ? 'Buy Credits' : 'Next'}
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                        {step === 2 && (
                            <BookingConfirmationPage
                                tutor={tutor}
                                selectedSlots={selectedSlots}
                                onBack={() => setStep(1)}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}