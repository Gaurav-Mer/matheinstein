/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Loader2, CalendarDays, BookOpen, Clock, Users, X, Search, MoreVertical, CheckCircle, Zap, XCircle } from "lucide-react";
import { format, differenceInMinutes, isPast } from 'date-fns';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import TutorLayout from '@/pages/tutor/_layout';
import { useTutorBookings } from '@/hooks/tutors/useTutorBookings';
import CancellationDialog from '../CancellationDialog';
import { useUpdateBookingStatus } from '@/hooks/bookings/useUpdateBookingStatus';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // Ensure Dialog is imported if not already

export default function MyBookings() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<'upcoming' | 'completed' | 'cancelled' | 'no_show'>('upcoming'); // Added 'no_show'
    const [cancelModalOpen, setCancelModalOpen] = useState(false);

    // State for the status update modal (Completed/No-Show)
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [targetStatus, setTargetStatus] = useState<'completed' | 'no_show'>('completed');

    const [selectedBooking, setSelectedBooking] = useState<any>(null);

    const { data: bookings, isLoading, error } = useTutorBookings({ status: selectedStatus });
    const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateBookingStatus();


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
    (booking.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            case "no_show":
                return <Badge variant="secondary" className="bg-orange-100 text-orange-600">No Show</Badge>; // Updated color for visibility
            case "rescheduled":
                return <Badge variant="secondary" className="bg-indigo-100 text-indigo-600">Rescheduled</Badge>; // Added Rescheduled status
            default:
                return <Badge variant="default" className="bg-primary/10 text-primary">Upcoming</Badge>;
        }
    };

    // --- Handlers for Status Change ---
    const handleStatusClick = (booking: any, status: 'completed' | 'no_show') => {
        setSelectedBooking(booking);
        setTargetStatus(status);
        setShowStatusModal(true);
    };

    const handleConfirmStatus = () => {
        if (selectedBooking) {
            updateStatus({ bookingId: selectedBooking.id, newStatus: targetStatus }, {
                onSuccess: () => {
                    setShowStatusModal(false);
                    setSelectedBooking(null);
                }
            });
        }
    };


    return (
        <TutorLayout>
            {/* Cancellation Dialog */}
            <CancellationDialog
                bookingId={selectedBooking?.id}
                isOpen={cancelModalOpen}
                onClose={() => setCancelModalOpen(false)}
                bookingDetails={selectedBooking}
            />

            {/* Status Update Dialog (Completed/No-Show) */}
            <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-center">Finalize Lesson Status</DialogTitle>
                        <DialogDescription className="text-center pt-2">
                            You are marking the session with **{selectedBooking?.student?.name}** as **&quot;{targetStatus.toUpperCase().replace('_', ' ')}&quot;**. This action is irreversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-4">
                        <Button variant="outline" onClick={() => setShowStatusModal(false)} disabled={isUpdatingStatus}>
                            Cancel
                        </Button>
                        <Button
                            variant={targetStatus === 'completed' ? 'default' : 'destructive'}
                            onClick={handleConfirmStatus}
                            disabled={isUpdatingStatus}
                            className="gap-2"
                        >
                            {isUpdatingStatus ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                            Confirm Status
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            <div className="p-6 md:p-10 min-h-screen bg-white">
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
                                placeholder="Search students or subjects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as 'upcoming' | 'completed' | 'cancelled' | 'no_show')}>
                                <SelectTrigger className="w-full h-11">
                                    <SelectValue placeholder="Filter by Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                    <SelectItem value="no_show">No Show</SelectItem>
                                    <SelectItem value="rescheduled">Rescheduled</SelectItem>
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
                                            <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">Student</TableHead>
                                            <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">Date & Time</TableHead>
                                            <TableHead className="font-semibold text-slate-700 px-6 py-4 text-center">Status</TableHead>
                                            <TableHead className="font-semibold text-slate-700 px-6 py-4 text-center">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredBookings.map((booking: any) => {
                                            const startTime = new Date(booking.startTime.seconds * 1000);
                                            const isCompleteActionable = booking.status === 'upcoming' && isPast(startTime);

                                            return (
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
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                                            <span className="text-slate-600">
                                                                {format(startTime, 'PPP')} @ {format(startTime, 'p')}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 text-center">
                                                        {getStatusBadge(booking.status)}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 text-center">
                                                        {booking.status === 'upcoming' && (
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm" className='w-8 h-8 p-0'>
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    {isCompleteActionable && (
                                                                        <>
                                                                            <DropdownMenuItem onClick={() => handleStatusClick(booking, 'completed')}>
                                                                                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                                                                Mark Complete
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => handleStatusClick(booking, 'no_show')}>
                                                                                <X className="h-4 w-4 mr-2 text-orange-600" />
                                                                                Mark No-Show
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuSeparator />
                                                                        </>
                                                                    )}
                                                                    <DropdownMenuItem asChild>
                                                                        <Link href={`/tutor/bookings/reschedule/${booking.id}`} className='text-slate-600'>
                                                                            <CalendarDays className="h-4 w-4 mr-2" />
                                                                            Reschedule
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => { setSelectedBooking(booking); setCancelModalOpen(true); }} className='text-red-600'>
                                                                        <XCircle className="h-4 w-4 mr-2" />
                                                                        Cancel Lesson
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 px-6">
                                <CalendarDays className="h-10 w-10 text-slate-400" />
                                <h3 className="text-xl font-semibold text-slate-800 mb-2">No Bookings Found</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6">You have no scheduled lessons in this category.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </TutorLayout>
    );
}