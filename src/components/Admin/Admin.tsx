/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useAdmins, useDeleteAdmin } from "@/hooks/useAdmins";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Loader2, User, Plus, Trash2, Search, Crown, ArrowLeft, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

export default function AdminsPage() {
    const { data: admins, isLoading, error } = useAdmins();
    const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();
    const [searchQuery, setSearchQuery] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState<string | null>(null);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-red-200 bg-red-50/50 rounded-2xl">
                <CardContent className="flex flex-col items-center justify-center p-8">
                    <h3 className="text-red-800 font-semibold text-lg">Failed to load admins</h3>
                    <p className="text-red-600 text-sm mt-1">Please try refreshing the page</p>
                </CardContent>
            </Card>
        );
    }

    const filteredAdmins = admins?.filter((admin: any) =>
        admin.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleDeleteClick = (uid: string) => {
        setAdminToDelete(uid);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (adminToDelete) {
            deleteAdmin(adminToDelete);
            setShowDeleteConfirm(false);
            setAdminToDelete(null);
        }
    };

    return (
        <div className="p-6  min-h-dvh bg-white">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6 md:mb-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-secondary/20 text-secondary">
                        <Crown className="h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
                        <p className="text-gray-500">Manage your platform administrators</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/dashboard">
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <Link href="/admin/invite-admin">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Invite Admin
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Search Section */}
            <div className="mb-6">
                <Input
                    placeholder="Search admins by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                />
            </div>

            {/* Content Section */}
            <Card className="border-slate-200/60 rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                    {filteredAdmins.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50 border-b border-slate-200/60 hover:bg-slate-50">
                                        <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">Admin Details</TableHead>
                                        <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">Role</TableHead>
                                        <TableHead className="font-semibold text-slate-700 px-6 py-4 text-left">Status</TableHead>
                                        <TableHead className="font-semibold text-slate-700 px-6 py-4 text-center w-48">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAdmins.map((admin: any) => (
                                        <TableRow key={admin.uid} className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors duration-150">
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <User className="h-5 w-5 text-slate-400" />
                                                    <div>
                                                        <p className="font-semibold text-slate-800">{admin.name}</p>
                                                        <p className="text-slate-500 text-sm">{admin.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 capitalize">
                                                <span className="text-slate-600">{admin.role}</span>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 capitalize">
                                                <Badge
                                                    variant="secondary"
                                                    className={`
                                                        ${admin.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
                                                    `}
                                                >
                                                    {admin.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(admin.uid)}
                                                        disabled={admin.role === "super-admin"} // Prevent deleting super-admins
                                                        className="gap-1"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                        Delete
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
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">No Admins Found</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                {admins?.length === 0 ? "Invite your first admin to get started." : `No admins match your search.`}
                            </p>
                            {admins?.length === 0 && (
                                <Link href="/admin/invite-admin">
                                    <Button className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Invite First Admin
                                    </Button>
                                </Link>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this admin? This action cannot be undone.
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
                                <XCircle className="mr-2 h-4 w-4" />
                            )}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}