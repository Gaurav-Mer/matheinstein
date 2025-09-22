/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useStudentDashboard } from "@/hooks/useStudentDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, GraduationCap, CalendarDays, BookOpen, Clock, ArrowRight, Hourglass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import StudentLayout from './_layout';

export default function StudentDashboardPage() {
    const { data: dashboardData, isLoading, error } = useStudentDashboard();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
            </div>
        );
    }

    if (error || !dashboardData) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
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

    const { profile, tutor, upcomingBookings } = dashboardData;

    return (
        <StudentLayout>
            <div className="p-6">
                {/* Header and Greeting */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Welcome, {profile?.name}!</h1>
                    <p className="text-slate-500 mt-1">Your student dashboard</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Main Content Column */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Summary */}
                        <Card className="bg-white shadow-xl rounded-2xl border-0">
                            <CardHeader className="p-6 border-b border-slate-100">
                                <CardTitle className="text-xl font-bold text-slate-800">
                                    Your Profile
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <User className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-slate-800">{profile?.name}</p>
                                        <p className="text-sm text-slate-500">{profile?.email}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Status</p>
                                    <Badge className="capitalize" variant={profile?.status === "active" ? "default" : "secondary"}>{profile?.status}</Badge>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Link href="/student/profile">
                                        <Button variant="outline">Edit Profile</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                        {/* Tutor Summary Card */}
                        <Card className="bg-white shadow-xl rounded-2xl border-0">
                            <CardHeader className="p-6 border-b border-slate-100">
                                <CardTitle className="text-xl font-bold text-slate-800">
                                    Your Assigned Tutor
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {tutor ? (
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                            <GraduationCap className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800 text-lg">{tutor.name}</p>
                                            <p className="text-sm text-slate-500">{tutor.bio || 'No bio available.'}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-center py-6">
                                        <Hourglass className="h-12 w-12 text-slate-400 mb-4" />
                                        <p className="text-lg font-semibold text-slate-800">Request Received!</p>
                                        <p className="text-sm text-slate-500 mt-1">An admin is finding the perfect tutor for you.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Upcoming Lessons Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="bg-white shadow-xl rounded-2xl border-0">
                            <CardHeader className="p-6 border-b border-slate-100">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-xl font-bold text-slate-800">Upcoming Lessons</CardTitle>
                                    <Link href="/student/bookings">
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
                                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                                        <CalendarDays className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800 text-lg">
                                                            {booking.subject} with {booking.tutor?.name}
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
                                            <p className="text-slate-400 text-sm mt-1">Book your first lesson to get started.</p>
                                        </div>
                                    )}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}