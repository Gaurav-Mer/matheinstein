/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Loader2, Users, CalendarDays, Clock, ArrowRight,
    DollarSign, Star, TrendingUp,
} from "lucide-react";
import Link from 'next/link';
import { format } from "date-fns";
import { Button } from '@/components/ui/button';
import { useTutorDashboard } from '@/hooks/tutors/useTutorDashboard';
import TutorLayout from './_layout';

export default function TutorDashboardPage() {
    const { data, isLoading, error } = useTutorDashboard();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-dvh bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-slate-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex justify-center items-center h-dvh bg-gradient-to-br from-slate-50 to-slate-100">
                <Card className="border-red-200 bg-red-50/50 max-w-md">
                    <CardContent className="flex flex-col items-center justify-center p-8">
                        <h3 className="text-red-800 font-semibold text-lg">Failed to load dashboard data</h3>
                        <p className="text-red-600 text-sm mt-1 text-center">Please try refreshing the page</p>
                        <Button className="mt-4" onClick={() => window.location.reload()}>
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { profile, upcomingBookings, assignedStudents } = data;
    const totalStudents = assignedStudents?.length || 0;
    const totalUpcomingBookings = upcomingBookings?.length || 0;

    // Placeholders for future features
    const totalEarnings = 2450;
    const averageRating = 4.8;
    const newStudentsTrend = "+18.2%";

    return (
        <TutorLayout>
            <div className="p-6  min-h-dvh bg-white">
                {/* Header and Greeting */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Welcome, {profile?.name}!</h1>
                    <p className="text-slate-500 mt-1">Your tutor dashboard</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content Column */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Metrics Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                            {/* Total Students */}
                            <Card className="bg-white shadow-xl rounded-2xl border-0 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-slate-500 text-sm font-medium">Total Students</p>
                                            <h2 className="text-4xl font-bold text-slate-800 mt-2">{totalStudents}</h2>
                                            <div className="flex items-center gap-1 mt-2">
                                                <TrendingUp className="h-4 w-4 text-green-500" />
                                                <span className="text-green-500 text-sm font-medium">{newStudentsTrend}</span>
                                            </div>
                                        </div>
                                        <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                                            <Users className="h-8 w-8 text-primary" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Upcoming Bookings */}
                            <Card className="bg-white shadow-xl rounded-2xl border-0 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-slate-500 text-sm font-medium">Upcoming Lessons</p>
                                            <h2 className="text-4xl font-bold text-slate-800 mt-2">{totalUpcomingBookings}</h2>
                                        </div>
                                        <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                                            <CalendarDays className="h-8 w-8 text-primary" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Earnings (Placeholder) */}
                            {/* <Card className="bg-white shadow-xl rounded-2xl border-0 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-slate-500 text-sm font-medium">Total Earnings</p>
                                            <h2 className="text-4xl font-bold text-slate-800 mt-2">${totalEarnings}</h2>
                                        </div>
                                        <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center">
                                            <DollarSign className="h-8 w-8 text-secondary" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card> */}

                            {/* Avg Rating (Placeholder) */}
                            {/* <Card className="bg-white shadow-xl rounded-2xl border-0 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-slate-500 text-sm font-medium">Average Rating</p>
                                            <h2 className="text-4xl font-bold text-slate-800 mt-2">{averageRating}</h2>
                                        </div>
                                        <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center">
                                            <Star className="h-8 w-8 text-secondary" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card> */}
                        </div>

                        {/* Upcoming Lessons Section */}
                        <Card className="bg-white shadow-xl rounded-2xl border-0">
                            <CardHeader className="p-6 border-b border-slate-100">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-xl font-bold text-slate-800">Upcoming Lessons</CardTitle>
                                    <Link href="/tutor/bookings">
                                        <Button variant="ghost" className="gap-2 text-primary hover:bg-primary/10">
                                            View All
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ul className="divide-y divide-slate-100">
                                    {upcomingBookings?.length > 0 ? (
                                        upcomingBookings.map((booking: any) => (
                                            <li key={booking.id} className="p-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                                                        <CalendarDays className="h-6 w-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800 text-lg">
                                                            {booking.subject} with {booking.student?.name}
                                                        </p>
                                                        <p className="text-sm text-slate-500 mt-1">
                                                            {format(new Date(booking.startTime.seconds * 1000), "PPP")}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                        Confirmed
                                                    </Badge>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-slate-400" />
                                                        <p className="text-sm font-medium text-slate-600">
                                                            {format(new Date(booking.startTime.seconds * 1000), "p")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))
                                    ) : (
                                        <div className="p-12 text-center">
                                            <CalendarDays className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                            <p className="text-slate-500 text-lg">No upcoming lessons scheduled.</p>
                                            <p className="text-slate-400 text-sm mt-1">Your new bookings will appear here</p>
                                        </div>
                                    )}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </TutorLayout>
    );
}

