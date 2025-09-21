/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useAdminBookings } from '@/hooks/useAdminBookings';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Loader2, CalendarDays, BookOpen, Clock, Search } from "lucide-react";
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

export default function BookingsList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState<'tutor' | 'student' | 'admin' | ''>('');
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

    // Fetch the bookings based on the selected filters
    const { data: bookingData, isLoading, error } = useAdminBookings({
        userId: selectedUserId,
        status: selectedStatus,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-dvh bg-slate-50/50 rounded-2xl">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !bookingData) {
        return (
            <Card className="border-red-200 bg-red-50/50 rounded-2xl">
                <CardContent className="flex flex-col items-center justify-center p-8">
                    <h3 className="text-red-800 font-semibold text-lg">Failed to load bookings</h3>
                    <p className="text-red-600 text-sm mt-1">Please try refreshing the page</p>
                </CardContent>
            </Card>
        );
    }

    const { bookings, users } = bookingData;

    // Filter the users based on the selected role for the dropdown
    const filteredUsersByRole = selectedRole
        ? users.filter((user: any) => user.role === selectedRole)
        : users;

    // Client-side search filtering on the fetched data
    const filteredBookings = bookings.filter((booking: any) =>
    (booking.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.tutor?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedRole('');
        setSelectedUserId('');
        setSelectedStatus('upcoming');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return <Badge variant="secondary" className="bg-green-100 text-green-600">Completed</Badge>;
            case "cancelled":
                return <Badge variant="secondary" className="bg-red-100 text-red-600">Cancelled</Badge>;
            default:
                return <Badge variant="default" className="bg-blue-100 text-blue-600">Upcoming</Badge>;
        }
    };

    return (
        <div className="h-full">
            {/* Header */}
            <Card className="shadow-lg rounded-xl mb-6">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <CalendarDays className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">Bookings Dashboard</h1>
                                <p className="text-slate-500 text-sm">Overview of all scheduled sessions</p>
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
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Select value={selectedRole} onValueChange={(role) => {
                            setSelectedRole(role as any);
                            setSelectedUserId('');
                        }}>
                            <SelectTrigger className="w-full h-11 ">
                                <SelectValue placeholder="Filter by Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ROLES">All Roles</SelectItem>
                                <SelectItem value="tutor">Tutor</SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedUserId} onValueChange={setSelectedUserId} disabled={!selectedRole}>
                            <SelectTrigger className="w-full h-11 ">
                                <SelectValue placeholder="Filter by User" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USERS">All Users</SelectItem>
                                {filteredUsersByRole.map((user: any) => (
                                    <SelectItem key={user.uid} value={user.uid}>
                                        {user.name} ({user.role})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant="outline" className="h-9 rounded-xl" onClick={clearFilters}>
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
                                        <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">Student</TableHead>
                                        <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">Tutor</TableHead>
                                        <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">Date</TableHead>
                                        <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">Time</TableHead>
                                        <TableHead className="font-semibold text-semibold text-slate-700 px-6 py-4 text-center">Status</TableHead>
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
                                                <span className="font-medium text-slate-800">{booking.student?.name || 'N/A'}</span>
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
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                                    <Search className="h-4 w-4 text-white" />
                                </div>
                            </div>
                            <div className="text-center max-w-md">
                                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                    No Bookings Found
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                    {bookings?.length === 0 ? "There are no bookings on the platform." : "No bookings match your filter criteria."}
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
