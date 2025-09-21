/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Mail, MapPin, BookOpen, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface StudentProfileTabProps {
    student: any;
}

export default function StudentProfileTab({ student }: StudentProfileTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Mail className="h-5 w-5" /> Student Info
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                        <p className="text-gray-800">{student.name}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-gray-800">{student.email}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <Badge className="capitalize" variant={student.status === "active" ? "default" : "secondary"}>{student.status}</Badge>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <User className="h-5 w-5" /> Parent Info
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Parent Name</p>
                        <p className="text-gray-800">{student.parentDetails?.name || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Parent Email</p>
                        <p className="text-gray-800">{student.parentDetails?.email || "N/A"}</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <MapPin className="h-5 w-5" /> Address
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Street</p>
                        <p className="text-gray-800">{student.address?.street || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">City, State</p>
                        <p className="text-gray-800">{student.address?.city || "N/A"}, {student.address?.state || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Country</p>
                        <p className="text-gray-800">{student.address?.country || "N/A"}</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <CalendarDays className="h-5 w-5" /> Upcoming Lessons
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {student.upcomingBookings?.length > 0 ? (
                        <ul className="space-y-2">
                            {student.upcomingBookings.map((booking: any) => (
                                <li key={booking.id} className="border-b pb-2 last:pb-0 last:border-b-0">
                                    <p className="font-medium">{booking.subject}</p>
                                    <p className="text-sm text-gray-500">
                                        {format(new Date(booking.startTime), "PPP")} at {format(new Date(booking.startTime), "p")}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No upcoming lessons.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}