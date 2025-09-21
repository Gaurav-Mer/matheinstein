/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useDeleteStudent, useStudents } from "@/hooks/useStudents";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Users, Loader2, Plus, Eye, Trash2, Search, GraduationCap, Mail, Filter } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { normalizeArray } from '@/lib/utils';
import { useTutors } from '@/hooks/useTutors';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface StudentListProps {
    canAdd?: boolean;
    canView?: boolean;
    canDelete?: boolean;
}

export default function StudentsList({ canAdd = true, canView = true, canDelete = true }: StudentListProps) {
    const { data: students, isLoading, error } = useStudents();
    const { data: tutorList, } = useTutors()
    const [searchQuery, setSearchQuery] = useState('');
    const { mutate: deleteStudent, isPending: isDeleting } = useDeleteStudent();

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<string | null>(null);


    const normalizeTutor = normalizeArray(tutorList || [], "uid")


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-dvh bg-white rounded-2xl border border-slate-200/60">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <Users className="h-3 w-3 text-white" />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-slate-600 font-medium">Loading students...</p>
                        <p className="text-slate-400 text-sm">Please wait a moment</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-red-200 bg-red-50/50 rounded-2xl">
                <CardContent className="flex flex-col items-center justify-center p-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="text-red-800 font-semibold text-lg">Failed to load students</h3>
                    <p className="text-red-600 text-sm mt-1">Please try refreshing the page</p>
                </CardContent>
            </Card>
        );
    }

    const filteredStudents = students?.filter((student: any) =>
        student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleDelete = (studentId: string) => {
        toast.info(`Deleting student ${studentId}...`);
    };

    const handleDeleteClick = (studentId: string) => {
        setStudentToDelete(studentId);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (studentToDelete) {
            deleteStudent(studentToDelete, {
                onSuccess: () => {
                    toast.success("Student deleted successfully!");
                    setShowDeleteConfirm(false);
                    setStudentToDelete(null);
                },
                onError: (err: any) => {
                    toast.error(err?.response?.data?.error || "Failed to delete student.");
                    setShowDeleteConfirm(false);
                    setStudentToDelete(null);
                }
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-2xl border border-slate-200/60 ">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <GraduationCap className="h-6 w-6 text-primary" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">{students?.length || 0}</span>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">Students</h1>
                                <p className="text-slate-500 text-sm">Manage your student database</p>
                            </div>
                        </div>
                        {canAdd && (
                            <Link href="/admin/students/new">
                                <Button className="bg-primary hover:text-primary text-white rounded-xl px-6 h-11 font-medium transition-all duration-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add New Student
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Search Section */}
                <div className="p-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                            placeholder="Search by name or email address..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 pr-4 h-12 bg-slate-50/50 border-slate-200/60 rounded-xl text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    {searchQuery && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                            <span>Showing {filteredStudents.length} of {students?.length || 0} students</span>
                            {searchQuery && (
                                <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">
                                    &quot;{searchQuery}&quot;
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <Card className="border-slate-200/60 rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                    {filteredStudents.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50 border-b border-slate-200/60 hover:bg-slate-50">
                                        <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">
                                            Student Details
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">
                                            Contact Info
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">
                                            Tutor Assigned
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 px-6 py-4 text-center w-48">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.map((student: any, index: number) => (
                                        <TableRow
                                            key={student.uid}
                                            className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors duration-150"
                                        >
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                                        <span className="text-primary font-semibold text-sm">
                                                            {student.name?.charAt(0)?.toUpperCase() || 'S'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800">{student.name}</p>
                                                        {/* <p className="text-slate-500 text-sm">Student #{student.uid.slice(-6)}</p> */}
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
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-600">{student.assignedTutorId ? normalizeTutor[student.assignedTutorId]?.name : 'Not Assigned'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    {canView && (
                                                        <Link href={`/admin/students/${student.uid}`}>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-slate-200 text-slate-600 hover:bg-primary/10 hover:text-primary hover:border-primary/20 rounded-lg px-3 h-8 text-xs font-medium transition-all duration-200"
                                                            >
                                                                <Eye className="h-3 w-3 mr-1" />
                                                                View
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {canDelete && (
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(student.uid)}
                                                            className="border-red-200 text-white hover:bg-red-50 hover:text-red-700 hover:border-red-300 rounded-lg px-3 h-8 text-xs font-medium transition-all duration-200"
                                                        >
                                                            <Trash2 className="h-3 w-3 mr-1" />
                                                            Delete
                                                        </Button>
                                                    )}
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
                                    <GraduationCap className="h-10 w-10 text-slate-400" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center">
                                    <Search className="h-4 w-4 text-white" />
                                </div>
                            </div>
                            <div className="text-center max-w-md">
                                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                    {students?.length === 0 ? "No Students Yet" : "No Results Found"}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                    {students?.length === 0
                                        ? "Start building your student database by adding your first student."
                                        : `We couldn't find any students matching "${searchQuery}". Try adjusting your search terms.`
                                    }
                                </p>
                                {students?.length === 0 && canAdd && (
                                    <Link href="/admin/students/new">
                                        <Button className="bg-blue-600 hover:text-primary text-white shadow-lg shadow-blue-300/25 rounded-xl px-6 h-11 font-medium transition-all duration-200 hover:shadow-xl hover:shadow-blue-400/30">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Your First Student
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this student? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                            )}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}