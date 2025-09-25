/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Loader2, DollarSign, Receipt, Package, CheckCircle, Download } from "lucide-react";
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import StudentLayout from '../_layout';
import { useStudentPurchases } from '@/hooks/useStudentPurchases';

export default function StudentBillingPage() {
    // Assuming lessonCredits is available from useAuth (as we structured earlier)
    const { lessonCredits } = useAuth();
    const { data: purchases, isLoading, error } = useStudentPurchases();

    // Calculate total spent for the metrics card
    const totalSpent = useMemo(() => {
        return purchases?.reduce((sum, tx) => sum + tx.totalAmountINR, 0) || 0;
    }, [purchases]);

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
                    <h3 className="text-red-800 font-semibold text-lg">Failed to load billing history.</h3>
                    <p className="text-red-600 text-sm mt-1">Check your network connection and try again.</p>
                </CardContent>
            </Card>
        );
    }

    const formatCurrency = (amount: number) => `₹${amount.toFixed(0)}`;

    return (
        <StudentLayout>
            <div className="p-6 md:p-10 min-h-screen bg-gray-50">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">Billing & Credits</h1>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="shadow-lg rounded-xl bg-white border-l-4 border-green-500">
                        <CardHeader><CardTitle className="text-xl font-bold text-green-700 flex items-center gap-2"><Package /> Remaining Credits</CardTitle></CardHeader>
                        <CardContent><p className="text-4xl font-bold text-green-600">{lessonCredits || 0}</p></CardContent>
                    </Card>
                    <Card className="shadow-lg rounded-xl bg-white border-l-4 border-blue-500">
                        <CardHeader><CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2"><DollarSign /> Total Spent (INR)</CardTitle></CardHeader>
                        <CardContent><p className="text-4xl font-bold text-slate-800">{formatCurrency(totalSpent)}</p></CardContent>
                    </Card>
                    <Card className="shadow-lg rounded-xl bg-white border-l-4 border-slate-500">
                        <CardHeader><CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2"><Receipt /> Total Purchases</CardTitle></CardHeader>
                        <CardContent><p className="text-4xl font-bold text-slate-800">{purchases?.length || 0}</p></CardContent>
                    </Card>
                </div>

                {/* History Table */}
                <Card className="shadow-lg rounded-xl overflow-hidden">
                    <CardHeader className="p-4 border-b"><CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2"><Receipt /> Purchase History</CardTitle></CardHeader>
                    <CardContent className="p-0">
                        {(purchases?.length ?? 0) > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50">
                                            <TableHead>Date</TableHead>
                                            <TableHead>Package Name</TableHead>
                                            <TableHead>Credits</TableHead>
                                            <TableHead>Amount (INR)</TableHead>
                                            <TableHead className='text-center'>Status</TableHead>
                                            <TableHead className='text-center'>Invoice</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {purchases?.map((tx: any) => (
                                            <TableRow key={tx.id}>
                                                <TableCell>{format(new Date(tx.purchaseDate), 'MMM d, yyyy')}</TableCell>
                                                <TableCell className='font-medium'>{tx.packageName}</TableCell>
                                                <TableCell>{tx.creditsPurchased}</TableCell>
                                                <TableCell className='font-bold text-slate-800'>{formatCurrency(tx.totalAmountINR)}</TableCell>
                                                <TableCell className='text-center'>
                                                    <Badge className='bg-green-100 text-green-700'>
                                                        <CheckCircle className='h-3 w-3 mr-1' /> Paid
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className='text-center'>
                                                    <Button variant='link' size='sm' disabled>
                                                        <Download className='h-4 w-4' />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <p className='p-6 text-center text-slate-500'>No purchase history yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </StudentLayout>
    );
}