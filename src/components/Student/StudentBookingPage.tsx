/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Loader2, CalendarDays, BookOpen, Clock, Users, X, Search } from "lucide-react";
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { useStudentBookings } from '@/hooks/students/useStudentBookings';
import StudentLayout from '@/pages/student/_layout';

export default function StudentBookingsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

    const { data: bookings, isLoading, error } = useStudentBookings({ status: selectedStatus });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
            </div>
        );
    }

    if (error || !bookings) {
        return (
            <Card className="border-red-200 bg-red-50/50 rounded-2xl">
                <CardContent className="flex flex-col items-center justify-center p-8">
                    <h3 className="text-red-800 font-semibold text-lg">Failed to load bookings</h3>
                    <p className="text-red-600 text-sm mt-1">Please try refreshing the page</p>
                </CardContent>
            </Card>
        );
    }

    const filteredBookings = bookings.filter((booking: any) =>
    (booking.tutor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.subject.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedStatus('upcoming');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return <Badge variant="secondary" className="bg-green-100 text-green-600">Completed</Badge>;
            case "cancelled":
                return <Badge variant="secondary" className="bg-red-100 text-red-600">Cancelled</Badge>;
            default:
                return <Badge variant="default" className="bg-primary/10 text-primary">Upcoming</Badge>;
        }
    };

    return (
        <div className="p-6 w-full bg-white">
            {/* Header */}
            <Card className="shadow-lg rounded-xl mb-6">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <CalendarDays className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">Your Bookings</h1>
                                <p className="text-slate-500 text-sm">Overview of all your scheduled sessions</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xl font-bold text-primary">
                                {bookings?.length || 0}
                            </span>
                            <p className="text-slate-500">Total Bookings</p>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Search and Filters */}
            <Card className="shadow-lg rounded-xl overflow-hidden mb-6">
                <CardHeader className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input
                            placeholder="Search tutors or subjects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as 'upcoming' | 'completed' | 'cancelled')}>
                            <SelectTrigger className="w-full h-11">
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" className="h-11 rounded-xl" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            {/* Bookings Table */}
            <Card className="shadow-lg rounded-xl overflow-hidden">
                <CardContent className="p-0">
                    {filteredBookings.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50 border-b border-slate-200/60 hover:bg-slate-50">
                                        <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">Session</TableHead>
                                        <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">Tutor</TableHead>
                                        <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">Date</TableHead>
                                        <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">Time</TableHead>
                                        <TableHead className="font-semibold text-slate-700 px-6 py-4 text-center">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBookings.map((booking: any) => (
                                        <TableRow key={booking.id} className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors duration-150">
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                                    <span className="text-slate-600 font-medium">{booking.subject || 'N/A'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <span className="font-medium text-slate-800">{booking.tutor?.name || 'N/A'}</span>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <span className="text-slate-600">{format(new Date(booking.startTime.seconds * 1000), 'PPP')}</span>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                                    <span className="text-slate-600">
                                                        {format(new Date(booking.startTime.seconds * 1000), 'p')} - {format(new Date(booking.endTime.seconds * 1000), 'p')}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-center">
                                                {getStatusBadge(booking.status)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 px-6">
                            <div className="relative mb-6">
                                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center">
                                    <CalendarDays className="h-10 w-10 text-slate-400" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-prmary rounded-xl flex items-center justify-center">
                                    <Search className="h-4 w-4 text-white" />
                                </div>
                            </div>
                            <div className="text-center max-w-md">
                                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                    No Bookings Found
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                    {bookings?.length === 0 ? "You have no bookings on the platform." : "No bookings match your filter criteria."}
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}