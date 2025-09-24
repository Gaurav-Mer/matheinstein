"use client";
import React, { useEffect } from 'react';
import StudentLayout from './_layout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const PaymentSuccessPage = () => {

    useEffect(() => {
        // You could use the session_id from the URL to update your database
        // and confirm the package purchase for the student.
        // const urlParams = new URLSearchParams(window.location.search);
        // const sessionId = urlParams.get('session_id');
        // if(sessionId) {
        //     // api.post('/student/confirm-payment', { sessionId });
        // }
    }, []);

    return (
        <StudentLayout>
            <div className="p-6 flex flex-col items-center justify-center text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                <p className="text-gray-600 mb-6">Thank you for your purchase. Your tutoring package has been added to your account.</p>
                <div className="flex gap-4">
                    <Button asChild>
                        <Link href="/student/dashboard">Go to Dashboard</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/student/bookings">Book a Session</Link>
                    </Button>
                </div>
            </div>
        </StudentLayout>
    );
};

export default PaymentSuccessPage;
