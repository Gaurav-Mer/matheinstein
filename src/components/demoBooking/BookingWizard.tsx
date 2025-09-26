/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useMemo } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, CalendarDays, BookOpen, User, ChevronRight, ChevronLeft, CheckCircle, Clock, Star, Play, GraduationCap } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
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
            label: dayjs(slot.startTime).format('MMM D, h:mm A'),
            value: slot.startTime,
        })) || [];
    }, [adminData]);

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

    // Re-usable component for each step's header
    const StepHeader = ({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) => (
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {icon}
            </div>
            <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
            <p className="text-md text-gray-500 mt-1">{subtitle}</p>
        </div>
    );

    // --- STEP 1: Subject Selection ---
    const renderStep1 = () => (
        <div>
            <StepHeader
                icon={<BookOpen className="w-8 h-8 text-blue-600" />}
                title="What do you want to learn?"
                subtitle="Select a subject to find a tutor for your demo session."
            />
            {isSubjectsLoading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subjects?.map((subject: any) => (
                        <button
                            key={subject.id}
                            type="button"
                            onClick={() => setValue('subjectId', subject.id, { shouldValidate: true })}
                            className={cn(
                                "p-4 border-2 rounded-lg text-left transition-all duration-200 flex items-center space-x-4",
                                watch('subjectId') === subject.id
                                    ? "border-blue-500 bg-blue-50 shadow-lg"
                                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                            )}
                        >
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">{subject.name}</h3>
                                <p className="text-sm text-gray-500">Expert tutors available</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
            {errors.subjectId && (
                <p className="text-red-500 text-sm mt-4 text-center">{errors.subjectId.message}</p>
            )}
        </div>
    );

    // --- STEP 2: Time Slot Selection ---
    const renderStep2 = () => {
        const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);

        const dailySlots = useMemo(() => {
            if (!selectedDay) return [];
            return availableTimeSlots.filter(slot => dayjs(slot.value).isSame(selectedDay, 'day'));
        }, [selectedDay, availableTimeSlots]);

        return (
            <div>
                <StepHeader
                    icon={<CalendarDays className="w-8 h-8 text-blue-600" />}
                    title="Schedule your demo"
                    subtitle={`Select a date and time with our demo specialist, ${selectedAdmin.name}.`}
                />
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 flex justify-center">
                        <DayPicker
                            mode="single"
                            selected={selectedDay}
                            onSelect={setSelectedDay}
                            disabled={{ before: new Date() }}
                            className="w-full"
                        />
                    </div>
                    <div className="flex-1 md:border-l md:pl-8">
                        <h3 className="text-lg font-semibold mb-4 text-center md:text-left">
                            {selectedDay ? `Available slots for ${dayjs(selectedDay).format('dddd, MMM D')}` : 'Please select a day'}
                        </h3>
                        {isSlotsLoading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            </div>
                        ) : selectedDay ? (
                            dailySlots.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {dailySlots.map((slot: any) => (
                                        <button
                                            key={slot.value}
                                            type="button"
                                            onClick={() => setValue('selectedSlot', slot.value, { shouldValidate: true })}
                                            className={cn(
                                                "p-3 border-2 rounded-lg transition-all duration-200 text-center",
                                                watch('selectedSlot') === slot.value
                                                    ? "border-blue-500 bg-blue-50 shadow-lg"
                                                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                            )}
                                        >
                                            <div className="text-md font-bold text-blue-600">{dayjs(slot.value).format('h:mm A')}</div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg">
                                    <p>No slots available for this day.</p>
                                </div>
                            )
                        ) : (
                            <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg">
                                <p>Select a date to see available times.</p>
                            </div>
                        )}
                        {errors.selectedSlot && (
                            <p className="text-red-500 text-sm mt-4 text-center">{errors.selectedSlot.message}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // --- STEP 3: Personal Information ---
    const renderStep3 = () => (
        <div>
            <StepHeader
                icon={<User className="w-8 h-8 text-blue-600" />}
                title="Tell us about yourself"
                subtitle="Just a few details to create your account and confirm your booking."
            />
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="studentName" className="text-sm font-medium text-gray-700">Full Name</Label>
                    <Input
                        id="studentName"
                        placeholder="e.g., John Doe"
                        {...register('studentName')}
                        className={cn("h-12 text-base", errors.studentName && "border-red-500")}
                    />
                    {errors.studentName && <p className="text-red-500 text-sm">{errors.studentName.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="studentEmail" className="text-sm font-medium text-gray-700">Email Address</Label>
                    <Input
                        id="studentEmail"
                        type="email"
                        placeholder="e.g., john.doe@example.com"
                        {...register('studentEmail')}
                        className={cn("h-12 text-base", errors.studentEmail && "border-red-500")}
                    />
                    {errors.studentEmail && <p className="text-red-500 text-sm">{errors.studentEmail.message}</p>}
                </div>
            </div>
        </div>
    );

    // --- FINAL STEP: Confirmation ---
    const renderStep4 = () => (
        <div className="text-center py-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">You're all set! 🎉</h2>
            <p className="text-md text-gray-600 mt-2">Your demo lesson request has been sent successfully.</p>
            <Card className="mt-8 text-left bg-gray-50 border-gray-200">
                <CardContent className="p-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">What's Next?</h3>
                    <div className="space-y-4 text-sm text-gray-700">
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                            <span>You will receive an email at <strong>{getValues('studentEmail')}</strong> with your login credentials.</span>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                            <span>Our team will confirm your session within the next 24 hours.</span>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                            <span>Join your lesson on <strong>{dayjs(getValues('selectedSlot')).format('dddd, MMMM D, YYYY')} at {dayjs(getValues('selectedSlot')).format('h:mm A')}</strong>.</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Button
                onClick={() => window.location.href = '/'}
                className="mt-8 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 h-12 rounded-lg font-semibold text-base"
            >
                Back to Homepage
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

    // Side information panel
    const InfoPanel = () => {
        const subjectName = subjects?.find((s: any) => s.id === watch('subjectId'))?.name;
        const selectedTime = watch('selectedSlot');
        return (
            <div className="hidden lg:block w-1/3 bg-blue-50 rounded-r-2xl p-8">
                <div className="sticky top-8">
                    <h3 className="text-xl font-bold text-gray-800">Booking Summary</h3>
                    <p className="text-gray-600 mt-1">Your 30-minute demo lesson</p>
                    <div className="mt-8 space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Subject</p>
                                <p className="font-semibold text-gray-800">{subjectName || 'Not selected'}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Time</p>
                                <p className="font-semibold text-gray-800">
                                    {selectedTime ? dayjs(selectedTime).format('ddd, MMM D, h:mm A') : 'Not selected'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <Star className="w-6 h-6 text-yellow-500" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Tutor</p>
                                <p className="font-semibold text-gray-800">{selectedAdmin.name}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-blue-100 pt-6">
                        <p className="text-sm text-gray-600">
                            This is a no-commitment demo to experience our platform. Meet a tutor, see how our interactive classroom works, and ask any questions you have.
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Card className="w-full max-w-5xl mx-auto shadow-2xl rounded-2xl border-0">
            <div className="flex">
                <div className="w-full lg:w-2/3">
                    <CardContent className="p-8 md:p-12">
                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {renderCurrentStep()}
                                {step < 4 && (
                                    <CardFooter className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200 px-0 pb-0">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setStep(step - 1)}
                                            disabled={step === 1 || isSubmitting}
                                            className="px-6 h-12 rounded-lg text-base"
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
                                            className="px-8 h-12 rounded-lg font-semibold text-base bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            {step === 3 ? (
                                                isSubmitting ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                        Booking...
                                                    </>
                                                ) : (
                                                    <>
                                                        Confirm Booking
                                                        <Play className="w-4 h-4 ml-2" />
                                                    </>
                                                )
                                            ) : (
                                                <>
                                                    Next Step
                                                    <ChevronRight className="w-4 h-4 ml-2" />
                                                </>
                                            )}
                                        </Button>
                                    </CardFooter>
                                )}
                            </form>
                        </FormProvider>
                    </CardContent>
                </div>
                {step < 4 && <InfoPanel />}
            </div>
        </Card>
    );
};
export default DemoBookingWizard;