/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useAdminDemoRequests, useAssignDemo } from '@/hooks/useAdminDemoRequests';
import { useTutors } from '@/hooks/useTutors';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Loader2, UserPlus, BookOpen, Clock, Search } from "lucide-react";
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useStudents } from '@/hooks/useStudents';
import { normalizeArray } from '@/lib/utils';
import { useSubjects } from '@/hooks/useSubjects';

export default function DemoRequestsList() {
    const { data: demoRequests, isLoading, error } = useAdminDemoRequests();
    const { data: tutors } = useTutors();
    const { mutate: assignDemo, isPending: isAssigning } = useAssignDemo();
    const { data: allStudents, isLoading: isAllStudentsLoading } = useStudents();
    const { data: allSubjects = [] } = useSubjects();


    const [searchQuery, setSearchQuery] = useState('');
    const [tutorAssignment, setTutorAssignment] = useState<Record<string, string>>({});

    if (isLoading || isAllStudentsLoading) {
        return (
            <div className="flex justify-center items-center h-dvh bg-slate-50">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !demoRequests) {
        return (
            <Card className="border-red-200 bg-red-50/50 rounded-2xl">
                <CardContent className="flex flex-col items-center justify-center p-8">
                    <h3 className="text-red-800 font-semibold text-lg">Failed to load demo requests</h3>
                    <p className="text-red-600 text-sm mt-1">Please try refreshing the page</p>
                </CardContent>
            </Card>
        );
    }

    const filteredRequests = !searchQuery ? demoRequests : demoRequests?.filter((req: any) =>
        req.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.student?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleAssignTutor = (requestId: string) => {
        const tutorId = tutorAssignment[requestId];
        if (!tutorId) {
            return toast.error("Please select a tutor to assign.");
        }

        assignDemo({ requestId, tutorId });
    };

    const normalizedStudents = normalizeArray(allStudents || [], "uid")
    const normalizedSub = normalizeArray(allSubjects || [], "id")
    console.log("normalizedStudents", normalizedStudents)
    return (
        <div className="p-6 md:p-10 min-h-dvh ">
            {/* Header */}
            <Card className="shadow-lg rounded-xl mb-6">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">Pending Demo Requests</h1>
                                <p className="text-slate-500 text-sm">Actionable list of new student requests</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xl font-bold text-primary">
                                {demoRequests?.length || 0}
                            </span>
                            <p className="text-slate-500">Total Pending</p>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Search and Table */}
            <Card className="shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="p-6">
                    <Input
                        placeholder="Search students or subjects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </CardHeader>
                <CardContent className="p-0">
                    {filteredRequests.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50 border-b border-slate-200/60 hover:bg-slate-50">
                                        <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">Student</TableHead>
                                        <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">Email</TableHead>
                                        <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">Requested Time</TableHead>
                                        <TableHead className="font-semibold text-slate-700 px-6 py-4 text-center">Subject</TableHead>
                                        <TableHead className="font-semibold text-slate-700 px-6 py-4 text-center">Assign Tutor</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRequests.map((request: any) => (
                                        <TableRow key={request.id} className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors duration-150">
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-slate-800">{normalizedStudents[request?.studentId ?? ""]?.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-600 font-medium">{normalizedStudents[request?.studentId ?? ""]?.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                                    <span className="text-slate-600">
                                                        {dayjs(new Date(request.createdAt?._seconds * 1000)).format("DD-MM-YYYY hh:mm a")}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-center">
                                                <Badge variant="default" className="bg-amber-100 text-amber-600 hover:bg-amber-100">
                                                    {normalizedSub[request?.subjectId]?.name}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-center">
                                                <div className="flex gap-2 items-center">
                                                    <Select
                                                        value={tutorAssignment[request.id] || ''}
                                                        onValueChange={(value) => setTutorAssignment({ ...tutorAssignment, [request.id]: value })}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Tutor" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {tutors?.map((tutor: any) => (
                                                                <SelectItem key={tutor.uid} value={tutor.uid}>
                                                                    {tutor.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleAssignTutor(request.id)}
                                                        className="gap-1"
                                                        disabled={isAssigning} // <-- Add this line
                                                    >
                                                        {isAssigning ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <UserPlus className="h-4 w-4" />
                                                        )}
                                                        Assign
                                                    </Button>
                                                </div>
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
                                    <BookOpen className="h-10 w-10 text-slate-400" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                                    <Search className="h-4 w-4 text-white" />
                                </div>
                            </div>
                            <div className="text-center max-w-md">
                                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                    No Demo Requests
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                    There are no pending demo requests at this time.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}