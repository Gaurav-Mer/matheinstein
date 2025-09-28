import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { twMerge } from 'tailwind-merge';
import { Approval } from '../svgs/students';

interface PendingRequestStatusProps {
    studentName: string;
    subjectName: string;
}

export function PendingRequestStatus({ studentName, subjectName }: PendingRequestStatusProps) {
    const progressPercentage = '50%';

    return (
        <div className="flex items-center justify-center flex-1 h-full px-4">
            <Card className="w-full max-w-4xl border-none rounded-2xl shadow-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CardHeader className="text-center items-center">
                    {/* Inline Premium Pending SVG */}
                    <div className="w-40 h-40 mx-auto bg-gradient-to-tr from-amber-200 to-amber-100 rounded-full flex items-center justify-center ">
                        <Approval />
                    </div>

                    <CardTitle className="text-2xl font-extrabold text-slate-800">
                        Hang Tight, <span className='text-primary font-bold'>{studentName}!</span>
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base text-slate-500 pt-2 px-6">
                        Your demo request for <span className="font-semibold">{subjectName}</span> is pending. We’re connecting you with the best tutor shortly.
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-6 pt-4">
                    <div className="w-full space-y-2">
                        {/* Progress Labels */}
                        <div className="flex justify-between text-xs font-medium text-black">
                            <span>Request Received</span>
                            <span>Tutor Assigned</span>
                            <span>Scheduled</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-300 rounded-full h-2 mt-1 overflow-hidden">
                            <div
                                className={twMerge(
                                    'h-2 rounded-full transition-all duration-500',
                                    'bg-gradient-to-r from-amber-400 to-amber-500'
                                )}
                                style={{ width: progressPercentage }}
                            />
                        </div>

                        <p className="text-center text-sm text-slate-500 pt-2">
                            You’ll receive an email once your session is confirmed.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
