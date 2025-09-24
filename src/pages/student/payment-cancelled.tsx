"use client";
import React from 'react';
import StudentLayout from './_layout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

const PaymentCancelledPage = () => {
    return (
        <StudentLayout>
            <div className="p-6 flex flex-col items-center justify-center text-center">
                <XCircle className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
                <p className="text-gray-600 mb-6">Your payment was not processed. You have not been charged.</p>
                <div className="flex gap-4">
                    <Button asChild>
                        <Link href="/student/packages">Try Again</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/student/dashboard">Go to Dashboard</Link>
                    </Button>
                </div>
            </div>
        </StudentLayout>
    );
};

export default PaymentCancelledPage;
