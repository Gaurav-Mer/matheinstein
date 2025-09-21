/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InviteAdminForm from '@/components/Admin/InviteAdminForm';
import AdminLayout from '../_layout';

export default function InviteAdminPage() {
    return (
        <AdminLayout>
            <div className="p-6  min-h-dvh bg-white">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 md:mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-secondary/20 text-secondary">
                            <Plus className="h-7 w-7" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Invite New Admin</h1>
                            <p className="text-gray-500">Securely create and invite a new administrator.</p>
                        </div>
                    </div>
                    <Link href="/admin/admins">
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Listing
                        </Button>
                    </Link>
                </div>

                <Card className="shadow-lg rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Admin Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <InviteAdminForm />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}