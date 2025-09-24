/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePublicTutor } from "@/hooks/usePublicTutor";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft, ShoppingCart, CheckCircle, Package } from "lucide-react";
import Link from 'next/link';
import { toast } from 'react-toastify';
import { usePurchasePackage } from '@/hooks/usePurchasePackage';
// ----------------------------------------------------
// FIX: CURRENCY UTILITY DEFINITION
// ----------------------------------------------------
const formatCurrency = (amount: number) => {
    // Since we decided to use INR as the base currency for now, 
    // we use a simple formatter.
    return `₹${amount.toFixed(0)}`;
};
// ----------------------------------------------------


// --- CURRENCY UTILITY (Best Practice) ---
// In production, this would be an API call, but for the UI, we assume a conversion rate.
const convertAndDisplay = (amount: number) => {
    // Assuming base price is INR (from schema) and display currency is a fixed standard
    const targetCurrency = 'USD'; // For display purposes
    const rate = 0.012; // Example rate: 1 INR = 0.012 USD
    const convertedAmount = amount * rate;
    return `$${convertedAmount.toFixed(2)}`;
};
// ----------------------------------------

export default function StudentPackagesPage() {
    const params = useParams();
    const tutorId = params?.tutorId as string;

    // We assume the usePublicTutor hook returns the tutor's paidLessons array
    const { data: tutor, isLoading, error } = usePublicTutor(tutorId);
    const { mutate: purchasePackage, isPending: isPurchasing } = usePurchasePackage();
    const router = useRouter()
    const [selectedPackage, setSelectedPackage] = useState<any>(null);

    // Filter packages to ensure they are valid
    const packages = tutor?.paidLessons?.filter((pkg: any) => pkg.credits > 0) || [];

    // Calculate total cost for the selected package (for display)
    const totalCost = useMemo(() => {
        return selectedPackage ? selectedPackage.price * selectedPackage.credits : 0;
    }, [selectedPackage]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
            </div>
        );
    }

    if (error || !tutor) {
        return <p className="text-center text-red-500 mt-20">Tutor not found.</p>;
    }

    const handlePurchase = () => {
        if (!selectedPackage) {
            return toast.error("Please select a package first.");
        }

        purchasePackage({ tutorId, packageData: selectedPackage }, {
            onSuccess: () => {
                // After successful purchase, redirect to the booking calendar to use credits
                router.push(`/tutors/${tutorId}/book`);
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.error || "Purchase failed.");
            }
        });
    };

    return (
        <div className="p-6 md:p-10 min-h-screen bg-gray-50">
            <Link href="/student/dashboard">
                <Button variant="outline" className="mb-6"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
            </Link>

            <h1 className="text-3xl font-bold text-slate-800 mb-2">Buy Lessons with {tutor.name}</h1>
            <p className="text-slate-500 mb-8">Select a package to purchase credits and start booking your sessions.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packages.length === 0 ? (
                    <Card className="md:col-span-3 text-center p-12 shadow-inner">
                        <Package className='h-10 w-10 text-slate-400 mx-auto mb-3' />
                        <p className="text-slate-600">This tutor has not set up any packages yet.</p>
                    </Card>
                ) : (
                    packages.map((pkg: any) => (
                        <Card
                            key={pkg.id || pkg.name}
                            className={`bg-white shadow-lg rounded-2xl transition-all duration-200 cursor-pointer ${selectedPackage?.name === pkg.name ? 'ring-4 ring-primary border-primary' : 'hover:shadow-xl'
                                }`}
                            onClick={() => setSelectedPackage(pkg)}
                        >
                            <CardHeader className="p-6 text-center border-b">
                                <h2 className="text-xl font-bold text-slate-800">{pkg.name}</h2>
                                <p className="text-slate-500">{pkg.duration} min sessions</p>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="text-center">
                                    <p className="text-5xl font-extrabold text-primary">
                                        {pkg.credits}
                                    </p>
                                    <p className="text-slate-600 mt-1">Lesson Credits</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-semibold text-slate-800">
                                        Total: {formatCurrency(pkg.price * pkg.credits)}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {formatCurrency(pkg.price)} per credit
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Final Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-4 flex justify-end">
                <div className="text-lg font-bold mr-4 flex items-center">
                    Total Cost (INR Base): {formatCurrency(totalCost)}
                </div>
                <Button
                    onClick={handlePurchase}
                    disabled={!selectedPackage || isPurchasing || packages.length === 0}
                    className="gap-2 px-8 h-12 bg-primary hover:bg-primary/90 transition-all duration-200"
                >
                    {isPurchasing ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShoppingCart className="h-5 w-5" />}
                    Proceed to Checkout
                </Button>
            </div>
        </div>
    );
}