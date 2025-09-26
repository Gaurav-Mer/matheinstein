/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useMemo } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CalendarDays, BookOpen, User, ChevronRight, ChevronLeft, CheckCircle, Clock, Star, Play } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import dayjs from 'dayjs';
import { usePublicSubjects } from '@/hooks/usePublicSubjects';
import { useDemoRequestForm } from '@/hooks/useDemoRequestForm';
import { usePublicDemoSlots } from '@/hooks/usePublicDemoSlots';
import { cn } from '@/lib/utils';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);

// --- ZOD SCHEMA (Central Validation) ---
const bookingWizardSchema = z.object({
    subjectId: z.string().min(1, "Please select a subject."),
    selectedSlot: z.string().min(1, "Please select a time slot."),
    studentName: z.string().min(2, "Your name is required."),
    studentEmail: z.string().email("A valid email is required."),
    adminId: z.string().min(1, "Internal error: Admin ID missing."),
});

type BookingWizardInput = z.infer<typeof bookingWizardSchema>;

const DemoBookingWizard = () => {
    const [step, setStep] = useState(1);
    const { data: subjects, isLoading: isSubjectsLoading } = usePublicSubjects();
    const { mutate: submitDemoRequest, isPending: isSubmitting } = useDemoRequestForm();

    // ⚠️ HARDCODED ADMIN ID: This simulates the landing page pre-selecting a specialist
    const selectedAdmin = useMemo(() => ({ uid: 'QqgXVhlN3WN22mYVPNCKu5s5NDT2', name: 'Demo Specialist', timeZone: 'Asia/Kolkata' }), []);

    // --- FETCH REAL SLOTS ---
    const demoSlotsQuery = useMemo(() => ({ userId: selectedAdmin.uid, month: dayjs().toISOString() }), [selectedAdmin.uid]);
    const { data: adminData, isLoading: isSlotsLoading } = usePublicDemoSlots(demoSlotsQuery);

    // Process the slots for the dropdown
    const availableTimeSlots = useMemo(() => {
        return adminData?.bookedSlots?.map((slot: any) => ({
            label: dayjs(slot.startTime).tz(selectedAdmin.timeZone).format('MMM D, h:mm A'),
            value: slot.startTime,
        })) || [];
    }, [adminData, selectedAdmin.timeZone]);

    const methods = useForm<BookingWizardInput>({
        resolver: zodResolver(bookingWizardSchema),
        defaultValues: { adminId: selectedAdmin.uid, selectedSlot: '', subjectId: '' },
        mode: 'onTouched',
    });

    const { handleSubmit, register, formState: { errors }, watch, setValue, getValues } = methods;

    const handleNext = async (currentStep: number) => {
        const fieldsToValidate: (keyof BookingWizardInput)[] = ({
            1: ['subjectId'],
            2: ['selectedSlot'],
            3: ['studentName', 'studentEmail']
        } as Record<number, (keyof BookingWizardInput)[]>)[currentStep] || [];

        const result = await methods.trigger(fieldsToValidate);
        if (result) {
            setStep(currentStep + 1);
        }
    };

    const onSubmit: SubmitHandler<BookingWizardInput> = (data) => {
        const finalPayload = {
            studentName: data.studentName,
            studentEmail: data.studentEmail,
            subjectId: data.subjectId,
            requestedDateTime: data.selectedSlot,
        };

        submitDemoRequest(finalPayload, {
            onSuccess: () => setStep(4)
        });
    };

    // Progress indicator
    const ProgressBar = () => (
        <div className="w-full mb-8">
            <div className="flex items-center justify-between mb-2">
                {[1, 2, 3].map((stepNum) => (
                    <div
                        key={stepNum}
                        className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all",
                            step >= stepNum
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-600"
                        )}
                    >
                        {stepNum}
                    </div>
                ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((step - 1) / 2) * 100}%` }}
                />
            </div>
        </div>
    );


    // --- STEP 1: Subject Selection ---
    const renderStep1 = () => (
        <div className="text-center space-y-8">
            <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <BookOpen className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">What would you like to learn?</h2>
                <p className="text-lg text-gray-600">Choose the subject you need help with</p>
            </div>

            {isSubjectsLoading ? (
                <div className="flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                    {subjects?.map((subject: any) => (
                        <button
                            key={subject.id}
                            type="button"
                            onClick={() => setValue('subjectId', subject.id, { shouldValidate: true })}
                            className={cn(
                                "p-4 border-2 rounded-xl text-left transition-all hover:shadow-md",
                                watch('subjectId') === subject.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300"
                            )}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                        {subject.name.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                                    <p className="text-sm text-gray-600">Professional tutoring available</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {errors.subjectId && (
                <p className="text-red-500 text-sm mt-2">{errors.subjectId.message}</p>
            )}
        </div>
    );

    // --- STEP 2: Time Slot Selection ---
    const renderStep2 = () => {
        const subjectName = subjects?.find((s: any) => s.id === watch('subjectId'))?.name || 'the subject';

        return (
            <div className="text-center space-y-8">
                <div className="space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CalendarDays className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">When works best for you?</h2>
                    <p className="text-lg text-gray-600">Select your preferred time for the demo lesson</p>

                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-lg py-2 px-4 max-w-md mx-auto">
                        <Clock className="w-4 h-4" />
                        <span>Demo with <strong>{selectedAdmin.name}</strong></span>
                    </div>
                </div>

                {isSlotsLoading ? (
                    <div className="flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                        {availableTimeSlots.length > 0 ? (
                            availableTimeSlots.map((slot: any) => (
                                <button
                                    key={slot.value}
                                    type="button"
                                    onClick={() => setValue('selectedSlot', slot.value, { shouldValidate: true })}
                                    className={cn(
                                        "p-4 border-2 rounded-xl transition-all hover:shadow-md",
                                        watch('selectedSlot') === slot.value
                                            ? "border-green-500 bg-green-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    )}
                                >
                                    <div className="text-center">
                                        <div className="font-semibold text-gray-900">
                                            {dayjs(slot.value).format('MMM D')}
                                        </div>
                                        <div className="text-lg font-bold text-green-600">
                                            {dayjs(slot.value).format('h:mm A')}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {dayjs(slot.value).format('dddd')}
                                        </div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-600 py-8">
                                <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p>No available slots at the moment</p>
                                <p className="text-sm">Please try again later</p>
                            </div>
                        )}
                    </div>
                )}

                {errors.selectedSlot && (
                    <p className="text-red-500 text-sm mt-2">{errors.selectedSlot.message}</p>
                )}
            </div>
        );
    };

    // --- STEP 3: Personal Information ---
    const renderStep3 = () => (
        <div className="text-center space-y-8">
            <div className="space-y-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-8 h-8 text-purple-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Almost there!</h2>
                <p className="text-lg text-gray-600">Tell us a bit about yourself</p>
            </div>

            <div className="max-w-md mx-auto space-y-6 text-left">
                <div className="space-y-2">
                    <Label htmlFor="studentName" className="text-sm font-medium text-gray-700">
                        Full Name
                    </Label>
                    <Input
                        id="studentName"
                        placeholder="Enter your full name"
                        {...register('studentName')}
                        className={cn(
                            "h-12 text-base",
                            errors.studentName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-primary"
                        )}
                    />
                    {errors.studentName && (
                        <p className="text-red-500 text-sm">{errors.studentName.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="studentEmail" className="text-sm font-medium text-gray-700">
                        Email Address
                    </Label>
                    <Input
                        id="studentEmail"
                        type="email"
                        placeholder="Enter your email address"
                        {...register('studentEmail')}
                        className={cn(
                            "h-12 text-base",
                            errors.studentEmail ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
                        )}
                    />
                    {errors.studentEmail && (
                        <p className="text-red-500 text-sm">{errors.studentEmail.message}</p>
                    )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <div className="flex items-start space-x-3">
                        <Star className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium">What happens next?</p>
                            <ul className="mt-2 space-y-1 text-blue-700">
                                <li>• You&apos;ll receive login details via email</li>
                                <li>• An admin will confirm your demo session</li>
                                <li>• Join your lesson at the scheduled time</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // --- FINAL STEP: Confirmation ---
    const renderStep4 = () => (
        <div className="text-center space-y-8 py-8">
            <div className="space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-gray-900">You&apos;re all set! 🎉</h2>
                    <p className="text-xl text-gray-600">Your demo lesson has been requested</p>
                </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 max-w-md mx-auto">
                <h3 className="font-semibold text-green-800 mb-3">What&apos;s next?</h3>
                <div className="space-y-3 text-sm text-green-700 text-left">
                    <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <span>Check your email <strong>({getValues('studentEmail')})</strong> for login details</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <span>An admin will confirm your demo session within 24 hours</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <span>Join your lesson on <strong>{dayjs(getValues('selectedSlot')).format('MMM D, h:mm A')}</strong></span>
                    </div>
                </div>
            </div>

            <Button
                onClick={() => window.location.href = '/'}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold"
            >
                Back to Home
            </Button>
        </div>
    );

    const renderCurrentStep = () => {
        switch (step) {
            case 1: return renderStep1();
            case 2: return renderStep2();
            case 3: return renderStep3();
            case 4: return renderStep4();
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-purple-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {step < 4 && <ProgressBar />}

                <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
                    <CardContent className="p-8 md:p-12">
                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {renderCurrentStep()}

                                {step < 4 && (
                                    <CardFooter className="flex justify-between items-center mt-12 pt-6 border-t border-gray-100">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setStep(step - 1)}
                                            disabled={step === 1 || isSubmitting}
                                            className="px-6 py-3 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50"
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-2" />
                                            Back
                                        </Button>

                                        <Button
                                            type={step === 3 ? 'submit' : 'button'}
                                            onClick={() => step < 3 && handleNext(step)}
                                            disabled={
                                                isSubmitting ||
                                                isSlotsLoading ||
                                                (step === 1 && !watch('subjectId')) ||
                                                (step === 2 && !watch('selectedSlot'))
                                            }
                                            className={cn(
                                                "px-8 py-3 rounded-lg font-semibold transition-all",
                                                step === 1 && "bg-blue-500 hover:bg-blue-600",
                                                step === 2 && "bg-green-500 hover:bg-green-600",
                                                step === 3 && "bg-purple-500 hover:bg-purple-600"
                                            )}
                                        >
                                            {step === 3 ? (
                                                isSubmitting ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Play className="w-4 h-4 mr-2" />
                                                        Book Demo Lesson
                                                    </>
                                                )
                                            ) : (
                                                <>
                                                    Continue
                                                    <ChevronRight className="w-4 h-4 ml-2" />
                                                </>
                                            )}
                                        </Button>
                                    </CardFooter>
                                )}
                            </form>
                        </FormProvider>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DemoBookingWizard