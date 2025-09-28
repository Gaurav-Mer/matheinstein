/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useMemo } from 'react';
import { useTutorEarnings } from '@/hooks/tutors/useTutorEarnings';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Loader2, DollarSign, Receipt, Package, CheckCircle, Clock } from "lucide-react";
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import TutorLayout from '../_layout';

export default function TutorEarningsPage() {
    const { data, isLoading, error } = useTutorEarnings();

    // Utility to format the INR payout for display
    const formatCurrency = (amount: number) => `₹${amount.toFixed(0)}`;

    const totalCompletedLessons = data?.totalCompletedLessons || 0;
    const totalPayoutLiability = data?.totalPayoutLiability || 0;
    const transactions = data?.transactions || [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-red-200 bg-red-50/50 rounded-2xl">
                <CardContent className="flex flex-col items-center justify-center p-8">
                    <h3 className="text-red-800 font-semibold text-lg">Failed to load earnings history.</h3>
                </CardContent>
            </Card>
        );
    }

    return (
        <TutorLayout>
            <div className="p-6 md:p-10 min-h-screen bg-gray-50">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">Your Earnings Ledger</h1>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="shadow-lg rounded-xl bg-white border-l-4 border-green-500">
                        <CardHeader><CardTitle className="text-xl font-bold text-green-700 flex items-center gap-2"><DollarSign /> Total Payout Owed</CardTitle></CardHeader>
                        <CardContent><p className="text-4xl font-bold text-green-600">{formatCurrency(totalPayoutLiability)}</p></CardContent>
                    </Card>
                    <Card className="shadow-lg rounded-xl bg-white border-l-4 border-blue-500">
                        <CardHeader><CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2"><Package /> Lessons Completed</CardTitle></CardHeader>
                        <CardContent><p className="text-4xl font-bold text-slate-800">{totalCompletedLessons}</p></CardContent>
                    </Card>
                    <Card className="shadow-lg rounded-xl bg-white border-l-4 border-slate-500">
                        {/* <CardHeader><CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2"><Clock /> Compensation Rate</CardTitle></CardHeader> */}
                        {/* <CardContent><p className="text-4xl font-bold text-slate-800">{formatCurrency(data?.compensationRate || 0)}</p></CardContent> */}
                    </Card>
                </div>

                {/* Transactions Table */}
                <Card className="shadow-lg rounded-xl overflow-hidden">
                    <CardHeader className="p-4 border-b"><CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2"><Receipt /> Completed Lesson History</CardTitle></CardHeader>
                    <CardContent className="p-0">
                        {transactions?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50">
                                            <TableHead>Completion Date</TableHead>
                                            <TableHead>Student ID</TableHead>
                                            <TableHead>Subject</TableHead>
                                            <TableHead className='text-center'>Rate Locked In</TableHead>
                                            <TableHead className='text-right'>Payout Value</TableHead>
                                            <TableHead className='text-center'>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transactions.map((tx: any) => (
                                            <TableRow key={tx.id}>
                                                <TableCell>{format(new Date(tx.completionDate), 'MMM d, yyyy')}</TableCell>
                                                <TableCell className='font-medium'>{tx.studentId.substring(0, 8)}...</TableCell>
                                                <TableCell className='font-medium'>{tx.subject}</TableCell>
                                                <TableCell className='text-center'>{formatCurrency(tx.tutorPayoutRate)}</TableCell>
                                                <TableCell className='font-bold text-slate-800 text-right'>{formatCurrency(tx.tutorPayoutRate)}</TableCell>
                                                <TableCell className='text-center'>
                                                    <Badge className='bg-green-100 text-green-700'>
                                                        <CheckCircle className='h-3 w-3 mr-1' /> {tx.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <p className='p-6 text-center text-slate-500'>No completed lessons yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </TutorLayout>
    );
}