/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { useAdminBookings } from "@/hooks/useAdminBookings";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Loader2, Users, GraduationCap, CalendarDays, BookOpen, Clock, ArrowRight,
    Zap
} from "lucide-react";
import Link from 'next/link';
import { format } from "date-fns";
import { Button } from '@/components/ui/button';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';


const PIE_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
                <p className="font-semibold text-slate-800">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ color: entry.color }} className="text-sm">
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
                <p className="font-semibold text-slate-800">{data.name}</p>
                <p style={{ color: data.color }} className="text-sm">
                    Count: {data.value}
                </p>
            </div>
        );
    }
    return null;
};

export default function AdminDashboardPage() {
    const { data: dashboardData, isLoading: isDashboardLoading, error: dashboardError } = useAdminDashboard();
    const { data: bookingData, isLoading: isBookingsLoading } = useAdminBookings({ limit: 5, status: 'upcoming' });
    const { data: analyticsData, isLoading: isAnalyticsLoading } = useAdminAnalytics();

    const isLoading = isDashboardLoading || isBookingsLoading || isAnalyticsLoading;

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

    if (dashboardError || !dashboardData) {
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

    const { totalTutors, totalStudents, totalUpcomingBookings, pendingDemoRequests } = dashboardData;
    const { monthlyBookings, studentStatus } = analyticsData || { monthlyBookings: [], studentStatus: [] };

    // Process student status data for pie chart
    const pieData = studentStatus?.length > 0 ? studentStatus.map((item: any) => ({
        ...item,
        color: PIE_COLORS[item.name] // Assuming PIE_COLORS is an object or array
    })) : [];

    // Process student status data for pie chart with percentages
    const processedStudentStatus = studentStatus.map((item: any, index: number) => ({
        ...item,
        color: PIE_COLORS[index % PIE_COLORS.length],
        percentage: ((item.value / studentStatus.reduce((sum: number, s: any) => sum + s.value, 0)) * 100).toFixed(1)
    }));

    return (
        <div className="p-6 md:p-10 min-h-dvh bg-white">
            {/* Premium Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Welcome, Admin!
                </h1>
                <p className="text-slate-500 mt-1">Advanced insights and real-time platform analytics</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Column */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Metrics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Tutors */}
                        <Card className="bg-white shadow-xl rounded-2xl border-0 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-slate-500 text-sm font-medium">Total Tutors</p>
                                        <h2 className="text-4xl font-bold text-slate-800 mt-2">{totalTutors}</h2>
                                    </div>
                                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <GraduationCap className="h-8 w-8 text-primary" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Total Students */}
                        <Card className="bg-white shadow-xl rounded-2xl border-0 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-slate-500 text-sm font-medium">Total Students</p>
                                        <h2 className="text-4xl font-bold text-slate-800 mt-2">{totalStudents}</h2>
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
                                        <p className="text-slate-500 text-sm font-medium">Upcoming Bookings</p>
                                        <h2 className="text-4xl font-bold text-slate-800 mt-2">{totalUpcomingBookings}</h2>
                                    </div>
                                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <CalendarDays className="h-8 w-8 text-primary" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pending Demo Requests */}
                        <Card className="bg-white shadow-xl rounded-2xl border-0 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-slate-500 text-sm font-medium">Pending Demos</p>
                                        <h2 className="text-4xl font-bold text-slate-800 mt-2">{pendingDemoRequests}</h2>
                                    </div>
                                    <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center">
                                        <BookOpen className="h-8 w-8 text-secondary" />
                                    </div>
                                </div>
                                {pendingDemoRequests > 0 && (
                                    <div className="mt-4">
                                        <Link href="/admin/bookings?status=pending">
                                            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                                                <Zap className="h-3 w-3 mr-1" />
                                                View requests
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <Card className="bg-white shadow-xl rounded-2xl">
                            <CardHeader className="p-6 border-b border-slate-100">
                                <CardTitle className="text-xl font-bold text-slate-800">Monthly Bookings</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={monthlyBookings}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fill: '#64748b', fontSize: 12 }}
                                            axisLine={{ stroke: '#cbd5e1' }}
                                        />
                                        <YAxis
                                            tick={{ fill: '#64748b', fontSize: 12 }}
                                            axisLine={{ stroke: '#cbd5e1' }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar
                                            dataKey="bookings"
                                            fill="url(#colorGradient)"
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <defs>
                                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            </linearGradient>
                                        </defs>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="bg-white shadow-xl rounded-2xl">
                            <CardHeader className="p-6 border-b border-slate-100">
                                <CardTitle className="text-xl font-bold text-slate-800">Student Status Distribution</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={processedStudentStatus}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            innerRadius={40}
                                            paddingAngle={5}
                                        >
                                            {processedStudentStatus.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomPieTooltip />} />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={36}
                                            formatter={(value: string) => (
                                                <span style={{ color: '#475569' }}>{value}</span>
                                            )}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Bookings Section */}
                    <Card className="bg-white shadow-xl rounded-2xl border-0">
                        <CardHeader className="p-6 border-b border-slate-100">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl font-bold text-slate-800">Recent Bookings</CardTitle>
                                <Link href="/admin/bookings">
                                    <Button variant="ghost" className="gap-2 text-primary hover:bg-primary/10">
                                        View All
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ul className="divide-y divide-slate-100">
                                {bookingData?.bookings?.length > 0 ? (
                                    bookingData.bookings.map((booking: any) => (
                                        <li key={booking.id} className="p-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                                                    <CalendarDays className="h-6 w-6 text-white" />
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
                                        <p className="text-slate-500 text-lg">No recent bookings to display.</p>
                                        <p className="text-slate-400 text-sm mt-1">New bookings will appear here</p>
                                    </div>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Premium Sidebar */}
            </div>
        </div>
    );
}

