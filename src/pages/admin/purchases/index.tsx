/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Loader2, DollarSign, Receipt, Package, CalendarDays, Filter } from "lucide-react";
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '../_layout'; // Assuming admin layout path
import { useAdminPurchases } from '@/hooks/useAdminPurchases';

export default function AdminPurchasesPage() {
    const { data: purchases, isLoading, error } = useAdminPurchases();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTutorId, setSelectedTutorId] = useState('');

    // Calculate key metrics
    const metrics = useMemo(() => {
        const totalRevenue = purchases?.reduce((sum, p) => sum + p.totalAmountINR, 0) || 0;
        const totalCreditsSold = purchases?.reduce((sum, p) => sum + p.creditsPurchased, 0) || 0;

        return { totalRevenue, totalCreditsSold };
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
                    <h3 className="text-red-800 font-semibold text-lg">Failed to load purchase data.</h3>
                    <p className="text-red-600 text-sm mt-1">Please check the API connection.</p>
                </CardContent>
            </Card>
        );
    }

    const formatCurrency = (amount: number) => `₹${amount.toFixed(0)}`;

    const filteredPurchases = purchases?.filter((p: any) =>
    (p.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tutorName?.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

    return (
        <AdminLayout>
            <div className="p-6 md:p-10 min-h-screen bg-gray-50">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">Financial Audit Dashboard</h1>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="shadow-lg rounded-xl bg-white border-l-4 border-blue-500">
                        <CardHeader><CardTitle className="text-sm font-medium text-slate-500">Total Platform Revenue</CardTitle></CardHeader>
                        <CardContent><p className="text-4xl font-bold text-slate-800">{formatCurrency(metrics.totalRevenue)}</p></CardContent>
                    </Card>
                    <Card className="shadow-lg rounded-xl bg-white border-l-4 border-green-500">
                        <CardHeader><CardTitle className="text-sm font-medium text-slate-500">Total Credits Sold</CardTitle></CardHeader>
                        <CardContent><p className="text-4xl font-bold text-slate-800">{metrics.totalCreditsSold}</p></CardContent>
                    </Card>
                    <Card className="shadow-lg rounded-xl bg-white border-l-4 border-slate-500">
                        <CardHeader><CardTitle className="text-sm font-medium text-slate-500">Total Transactions</CardTitle></CardHeader>
                        <CardContent><p className="text-4xl font-bold text-slate-800">{purchases?.length || 0}</p></CardContent>
                    </Card>
                </div>

                {/* History Table */}
                <Card className="shadow-lg rounded-xl overflow-hidden">
                    <CardHeader className="border-b flex justify-between items-center">
                        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2"><Receipt /> Purchase History</CardTitle>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Search student/tutor name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64"
                            />
                            {/* Tutor Filter would go here if needed */}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {filteredPurchases.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50">
                                            <TableHead>Date</TableHead>
                                            <TableHead>Student</TableHead>
                                            <TableHead>Tutor</TableHead>
                                            <TableHead>Package</TableHead>
                                            <TableHead className='text-center'>Credits</TableHead>
                                            <TableHead className='text-right'>Amount (INR)</TableHead>
                                            <TableHead className='text-center'>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPurchases.map((tx: any) => (
                                            <TableRow key={tx.id}>
                                                <TableCell>{format(new Date(tx.purchaseDate), 'MMM d, yyyy')}</TableCell>
                                                <TableCell className='font-medium'>{tx.studentName}</TableCell>
                                                <TableCell className='font-medium'>{tx.tutorName}</TableCell>
                                                <TableCell>{tx.packageName}</TableCell>
                                                <TableCell className='text-center font-bold text-primary'>{tx.creditsPurchased}</TableCell>
                                                <TableCell className='font-bold text-slate-800 text-right'>{formatCurrency(tx.totalAmountINR)}</TableCell>
                                                <TableCell className='text-center'>
                                                    <Badge className='bg-green-100 text-green-700'>Paid</Badge>
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
        </AdminLayout>
    );
}