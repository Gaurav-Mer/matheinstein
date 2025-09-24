/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePublicTutor } from "@/hooks/usePublicTutor";
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, ArrowLeft, ShoppingCart, CheckCircle, Package, Receipt, DollarSign, CreditCard } from "lucide-react";
import Link from 'next/link';
import { toast } from 'react-toastify';
import { usePurchasePackage } from '@/hooks/usePurchasePackage';
import StudentLayout from '../_layout';

// --- CURRENCY UTILITY ---
const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(0)}`;
};
// -------------------------


export default function StudentCheckoutPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const tutorId = params?.tutorId as string;

    const { data: tutor, isLoading, error } = usePublicTutor(tutorId);
    const { mutate: purchasePackage, isPending: isPurchasing } = usePurchasePackage();

    const [selectedPackage, setSelectedPackage] = useState<any>(null);

    const packages = tutor?.paidLessons?.filter((pkg: any) => pkg.credits > 0) || [];

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
        if (!user?.uid) {
            return toast.error("Authentication error. Please log in again.");
        }

        purchasePackage({ tutorId, packageData: selectedPackage }, {
            onSuccess: () => {
                // Critical step: Redirect student back to the booking calendar to use their new credits
                router.push(`/tutors/${tutorId}`);
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.error || "Purchase failed.");
            }
        });
    };

    const renderPackageSelection = () => {
        if (packages.length === 0) {
            return (
                <Card className="lg:col-span-2 shadow-inner bg-slate-100/70 border-dashed border-slate-300">
                    <CardContent className="p-12 text-center flex flex-col items-center">
                        <Package className='h-12 w-12 text-slate-400 mx-auto mb-4' />
                        <h3 className="text-xl font-semibold text-slate-700">No Packages Defined</h3>
                        <p className="text-sm text-slate-500 mt-1">
                            This tutor ({tutor.name}) has not set up any lesson packages yet. Please contact admin for options.
                        </p>
                    </CardContent>
                </Card>
            );
        }

        return (
            <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-lg rounded-xl">
                    <CardHeader><CardTitle>Select Package</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {packages.map((pkg: any) => (
                            <Card
                                key={pkg.id || pkg.name}
                                className={`bg-white shadow-md rounded-xl transition-all duration-200 cursor-pointer ${selectedPackage?.name === pkg.name ? 'ring-4 ring-primary border-primary' : 'hover:shadow-lg'
                                    }`}
                                onClick={() => setSelectedPackage(pkg)}
                            >
                                <CardContent className="p-4 text-center">
                                    <p className="text-sm text-slate-500 mb-1">{pkg.duration} min sessions</p>
                                    <h3 className="text-3xl font-extrabold text-primary mb-2">
                                        {pkg.credits}
                                    </h3>
                                    <p className="text-slate-600 font-semibold">{pkg.name}</p>
                                </CardContent>
                                <CardFooter className="justify-center p-3 border-t">
                                    <span className="text-lg font-bold">
                                        {formatCurrency(pkg.price * pkg.credits)}
                                    </span>
                                </CardFooter>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    };

    return (
        <StudentLayout>
            <div className="p-6 md:p-10 min-h-screen bg-gray-50">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Finalize Purchase</h1>
                <p className="text-slate-500 mb-8">Securely purchase your lesson credits.</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Package Selection */}
                    {renderPackageSelection()}

                    {/* Right Column: Order Summary & Payment */}
                    <Card className="lg:col-span-1 shadow-lg rounded-xl h-fit">
                        <CardHeader className="border-b">
                            <CardTitle className="flex items-center gap-2">
                                <Receipt className='h-5 w-5' /> Order Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <p className="flex justify-between text-sm text-slate-600">
                                    <span>{selectedPackage?.credits || 0} x Lesson Credits</span>
                                    <span>{formatCurrency(totalCost)}</span>
                                </p>
                                <p className="flex justify-between text-sm text-slate-600">
                                    <span>Price Per Credit (INR Base)</span>
                                    <span>{formatCurrency(selectedPackage?.price || 0)}</span>
                                </p>
                                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                    <span>Total (Charged to Card)</span>
                                    <span>{formatCurrency(totalCost)}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={handlePurchase}
                                disabled={!selectedPackage || isPurchasing || packages.length === 0}
                                className="w-full gap-2 h-12 bg-primary hover:bg-primary/90 transition-all duration-200"
                            >
                                {isPurchasing ? <Loader2 className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5" />}
                                Pay Now & Get {selectedPackage?.credits || 0} Credits
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </StudentLayout>
    );
}