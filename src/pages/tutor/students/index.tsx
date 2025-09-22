/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useTutorStudents } from '@/hooks/tutors/useTutorStudents';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Loader2, Users, GraduationCap, Mail, Search, Plus, X } from "lucide-react";
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import TutorLayout from '../_layout';

export default function TutorStudentsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<'active' | 'inactive' | 'onboarding'>('active');

    const { data: students, isLoading, error } = useTutorStudents({ status: selectedStatus });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
            </div>
        );
    }

    if (error || !students) {
        return (
            <Card className="border-red-200 bg-red-50/50 rounded-2xl">
                <CardContent className="flex flex-col items-center justify-center p-8">
                    <h3 className="text-red-800 font-semibold text-lg">Failed to load students</h3>
                    <p className="text-red-600 text-sm mt-1">Please try refreshing the page</p>
                </CardContent>
            </Card>
        );
    }

    const filteredStudents = students.filter((student: any) =>
        student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedStatus('active');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge variant="default" className="bg-green-100 text-green-600">Active</Badge>;
            case "inactive":
                return <Badge variant="secondary" className="bg-red-100 text-red-600">Inactive</Badge>;
            default:
                return <Badge variant="default" className="bg-amber-100 text-amber-600">Onboarding</Badge>;
        }
    };

    return (
        <TutorLayout>
            <div className="p-6  bg-white">
                {/* Header */}
                <Card className="shadow-lg rounded-xl mb-6">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 text-primary/20 rounded-xl flex items-center justify-center">
                                    <GraduationCap className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800">Your Students</h1>
                                    <p className="text-slate-500 text-sm">Overview of all students assigned to you</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xl font-bold text-primary">
                                    {students?.length || 0}
                                </span>
                                <p className="text-slate-500">Total Students</p>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Search and Filters */}
                <Card className="shadow-lg rounded-xl overflow-hidden mb-6">
                    <CardHeader className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Input
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as 'active' | 'inactive' | 'onboarding')}>
                                <SelectTrigger className="w-full h-11">
                                    <SelectValue placeholder="Filter by Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="onboarding">Onboarding</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" className="h-11 rounded-xl" onClick={clearFilters}>
                                Clear Filters
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                {/* Students Table */}
                <Card className="shadow-lg rounded-xl overflow-hidden">
                    <CardContent className="p-0">
                        {filteredStudents.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50 border-b border-slate-200/60 hover:bg-slate-50">
                                            <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">Student Details</TableHead>
                                            <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">Contact Info</TableHead>
                                            <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredStudents.map((student: any) => (
                                            <TableRow key={student.uid} className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors duration-150">
                                                <TableCell className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                                            <span className="text-primary font-semibold text-sm">
                                                                {student.name?.charAt(0)?.toUpperCase() || 'S'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-800">{student.name}</p>
                                                            <p className="text-slate-500 text-sm">{student.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                                        <span className="text-slate-600">{student.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    {getStatusBadge(student.status)}
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
                                        <Users className="h-10 w-10 text-slate-400" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                                        <Search className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                                <div className="text-center max-w-md">
                                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                        No Students Found
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                        {students?.length === 0 ? "You have no students assigned to you yet." : "No students match your search."}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </TutorLayout>
    );
}