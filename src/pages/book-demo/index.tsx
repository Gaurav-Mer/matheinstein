// pages/book-demo.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import DemoBookingWizard from '@/components/demoBooking/BookingWizard';
export default function BookDemoPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-5xl mx-auto">
                {/* Header */}
                <header className="mb-8 flex items-center justify-between">
                    <Link href="/" passHref>
                        <Button variant="ghost" className="text-gray-600 hover:bg-gray-100">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
                        </Button>
                    </Link>
                </header>
                {/* Main Content */}
                <main className="flex justify-center">
                    <DemoBookingWizard />
                </main>
            </div>
        </div>
    );
}