/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useStudentTutors } from '@/hooks/students/useStudentTutors';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Loader2, Users, GraduationCap, Mail, Search } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import StudentLayout from '../_layout';

export default function StudentTutorsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const { data: tutors, isLoading, error } = useStudentTutors();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
            </div>
        );
    }

    if (error || !tutors) {
        return (
            <Card className="border-red-200 bg-red-50/50 rounded-2xl">
                <CardContent className="flex flex-col items-center justify-center p-8">
                    <h3 className="text-red-800 font-semibold text-lg">Failed to load tutors</h3>
                    <p className="text-red-600 text-sm mt-1">Please try refreshing the page</p>
                </CardContent>
            </Card>
        );
    }

    const filteredTutors = tutors.filter((tutor: any) =>
        tutor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <StudentLayout>
            <div className="p-6 md:p-10 min-h-screen bg-gray-50">
                {/* Header */}
                <Card className="shadow-lg rounded-xl mb-6">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <GraduationCap className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800">Your Tutors</h1>
                                    <p className="text-slate-500 text-sm">Overview of all tutors assigned to you</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xl font-bold text-primary">
                                    {tutors?.length || 0}
                                </span>
                                <p className="text-slate-500">Total Tutors</p>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Search and Filters */}
                <Card className="shadow-lg rounded-xl overflow-hidden mb-6">
                    <CardHeader className="p-6">
                        <Input
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </CardHeader>
                </Card>

                {/* Tutors Table */}
                <Card className="shadow-lg rounded-xl overflow-hidden">
                    <CardContent className="p-0">
                        {filteredTutors.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50 border-b border-slate-200/60 hover:bg-slate-50">
                                            <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">Tutor Details</TableHead>
                                            <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">Contact Info</TableHead>
                                            <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">Subjects</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredTutors.map((tutor: any) => (
                                            <Link href={`/student/tutor/${tutor.uid}`} passHref key={tutor.uid}>
                                                <TableRow className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors duration-150 cursor-pointer">
                                                    <TableCell className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                                                <span className="text-primary font-semibold text-sm">
                                                                    {tutor.name?.charAt(0)?.toUpperCase() || 'T'}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-800">{tutor.name}</p>
                                                                <p className="text-slate-500 text-sm">{tutor.bio || 'No bio provided.'}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                                            <span className="text-slate-600">{tutor.email}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            {tutor.subjects?.length > 0 ? (
                                                                tutor.subjects.map((sub: string) => (
                                                                    <Badge key={sub} variant="secondary">{sub}</Badge>
                                                                ))
                                                            ) : (
                                                                <span className="text-slate-500">No subjects listed.</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            </Link>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 px-6">
                                <div className="relative mb-6">
                                    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center">
                                        <GraduationCap className="h-10 w-10 text-slate-400" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                                        <Search className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                                <div className="text-center max-w-md">
                                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                        No Tutors Found
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                        {tutors?.length === 0 ? "You have no tutors assigned yet." : "No tutors match your search."}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </StudentLayout>
    );
}