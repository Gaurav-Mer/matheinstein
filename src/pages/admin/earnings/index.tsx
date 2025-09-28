/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useMemo } from 'react';
import { useAdminEarnings } from '@/hooks/useAdminEarnings';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Loader2, GraduationCap, TrendingUp } from "lucide-react";
import AdminLayout from '../_layout';
import { useAdminFinancialMetrics } from '@/hooks/useAdminFinancialMetrics';

export default function AdminEarningsDashboard() {
    // 1. Fetching Payout Data (Cost)
    const { data: earnings, isLoading: isEarningsLoading, error: earningsError } = useAdminEarnings();

    // 2. Fetching Financial Metrics (Revenue & Profit)
    const { data: metrics, isLoading: isMetricsLoading, error: metricsError } = useAdminFinancialMetrics();

    // Consolidate loading and error states
    const isLoading = isEarningsLoading || isMetricsLoading;

    // Utility to format the INR payout for display
    const formatCurrency = (amount: number) => `₹${amount.toFixed(0)}`;

    // Calculate platform totals (Payout Liability and Total Lessons)
    const platformMetrics = useMemo(() => {
        const totalPayout = earnings?.reduce((sum, t) => sum + t.payout, 0) || 0;
        const totalLessons = earnings?.reduce((sum, t) => sum + t.lessons, 0) || 0;

        // Data now comes directly from the dedicated hook (metrics)
        const totalGrossRevenue = metrics?.totalGrossRevenue || 0;
        const netPlatformProfit = metrics?.netPlatformProfit || 0;

        return { totalPayout, totalLessons, totalGrossRevenue, netPlatformProfit };
    }, [earnings, metrics]);

    if (isLoading) {
        return <Loader2 className="h-10 w-10 animate-spin text-gray-500 mx-auto mt-20" />;
    }

    if (earningsError || metricsError) {
        return <p className='text-center mt-20 text-red-500'>Failed to load financial report. Check API connection.</p>;
    }

    return (
        <AdminLayout>
            <div className="p-6 md:p-10 min-h-screen bg-gray-50">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">Financial Audit Dashboard</h1>

                {/* Metrics Cards (4-Column Layout) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                    {/* 1. TOTAL PLATFORM REVENUE (Gross) */}
                    <Card className="shadow-lg rounded-xl bg-white border-l-4 border-purple-600">
                        <CardHeader><CardTitle className="text-sm font-medium text-slate-500">Total Revenue (Gross)</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-purple-600">{formatCurrency(platformMetrics.totalGrossRevenue)}</p>
                            <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><TrendingUp className='h-3 w-3' /> Total Sales</p>
                        </CardContent>
                    </Card>

                    {/* 2. NET PROFIT (The Margin) */}
                    <Card className="shadow-lg rounded-xl bg-white border-l-4 border-green-600">
                        <CardHeader><CardTitle className="text-sm font-medium text-slate-500">Net Platform Profit</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-green-600">{formatCurrency(platformMetrics.netPlatformProfit)}</p>
                            <p className='text-xs text-slate-500 mt-2'>After tutor compensation</p>
                        </CardContent>
                    </Card>

                    {/* 3. TOTAL PAYOUT LIABILITY (The Cost) */}
                    <Card className="shadow-lg rounded-xl bg-white border-l-4 border-red-600">
                        <CardHeader><CardTitle className="text-sm font-medium text-slate-500">Payout Owed (Liability)</CardTitle></CardHeader>
                        <CardContent><p className="text-4xl font-bold text-red-600">{formatCurrency(platformMetrics.totalPayout)}</p></CardContent>
                    </Card>

                    {/* 4. Total Lessons Completed */}
                    <Card className="shadow-lg rounded-xl bg-white border-l-4 border-blue-600">
                        <CardHeader><CardTitle className="text-sm font-medium text-slate-500">Total Lessons Completed</CardTitle></CardHeader>
                        <CardContent><p className="text-4xl font-bold text-blue-600">{platformMetrics.totalLessons}</p></CardContent>
                    </Card>
                </div>

                {/* Earnings Table */}
                <Card className="shadow-lg rounded-xl overflow-hidden">
                    <CardHeader className="border-b flex justify-between items-center">
                        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2"><GraduationCap /> Payout Breakdown by Tutor</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {(earnings?.length ?? 0) > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50">
                                            <TableHead>Tutor Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead className='text-center'>Lessons Completed</TableHead>
                                            <TableHead className='text-right'>Total Payout Owed</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {earnings?.map((tutor: any) => (
                                            <TableRow key={tutor.uid}>
                                                <TableCell className='font-medium'>{tutor.name}</TableCell>
                                                <TableCell className='text-slate-600'>{tutor.email}</TableCell>
                                                <TableCell className='text-center font-bold'>{tutor.lessons}</TableCell>
                                                <TableCell className='font-extrabold text-green-700 text-right'>
                                                    {formatCurrency(tutor.payout)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <p className='p-6 text-center text-slate-500'>No completed lessons to generate payout reports.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}