import React from 'react';
import AdminLayout from './_layout';
import AdminDashboardData from '@/components/Admin/AdminDashboardData';

export default function AdminDashboardPage() {


    return (
        <AdminLayout>
            <AdminDashboardData />
        </AdminLayout>
    );
}