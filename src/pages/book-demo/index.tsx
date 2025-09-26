// pages/book-demo.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import DemoBookingWizard from '@/components/demoBooking/BookingWizard';

export default function BookDemoPage() {
    return (
        // The main container centers the wizard on a clean background
        <div className="min-h-dvh bg-slate-50 p-6 ">
            {/* Minimal Navigation Header */}
            <header className="mb-8">
                <Link href="/" passHref>
                    <Button variant="ghost" className="text-slate-600 hover:bg-slate-100">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
                    </Button>
                </Link>
            </header>

            {/* The Wizard Component is centered */}
            <div className="flex justify-center">
                <DemoBookingWizard />
            </div>
        </div>
    );
}