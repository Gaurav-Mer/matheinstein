/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Zap, AlertTriangle, XCircle, Clock } from "lucide-react";
import { useCancelBooking } from "@/hooks/useBookingManagement"; // Assuming a shared hooks file
import { toast } from 'react-toastify';

interface CancellationDialogProps {
    bookingId: string;
    isOpen: boolean;
    onClose: () => void;
    bookingDetails: any; // Contains startTime, subject, etc.
}

export default function CancellationDialog({ bookingId, isOpen, onClose, bookingDetails }: CancellationDialogProps) {
    const { mutate: cancelBooking, isPending: isCanceling } = useCancelBooking();

    // Check if the lesson is within the 24-hour non-refundable window (frontend UX check)
    const timeUntilLesson = new Date(bookingDetails.startTime.seconds * 1000).getTime() - new Date().getTime();
    const hoursUntilLesson = timeUntilLesson / (1000 * 60 * 60);
    const isPastRefundWindow = hoursUntilLesson <= 24;

    const handleCancel = () => {
        cancelBooking(bookingId, {
            onSuccess: (data) => {
                // The backend API returns a message indicating if the refund was processed.
                toast.success(data.message || "Lesson cancelled successfully!");
                onClose();
            },
            onError: (err) => {
                toast.error(err?.response?.data?.error || "Failed to cancel lesson.");
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <XCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
                    <DialogTitle className="text-xl text-center text-slate-800">
                        Confirm Cancellation
                    </DialogTitle>
                    <DialogDescription className="text-center text-slate-600">
                        This action cannot be undone. You are about to cancel your session for **{bookingDetails.subject}**.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 border-y">
                    <div className="p-3 rounded-lg flex items-center gap-3 bg-red-50 border border-red-200">
                        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-700 font-medium">
                            {isPastRefundWindow
                                ? "⚠️ The 24-hour refund window has CLOSED. No credit will be returned."
                                : "✅ This cancellation is eligible for a **1 credit refund**."}
                        </p>
                    </div>
                </div>

                <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between">
                    <Button variant="outline" onClick={onClose} disabled={isCanceling}>
                        Go Back
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleCancel}
                        disabled={isCanceling}
                        className="gap-2"
                    >
                        {isCanceling ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                        Yes, Cancel Lesson
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ----------------------------------------------------
// ⚠️ HOW TO INTEGRATE THIS COMPONENT ⚠️
// ----------------------------------------------------
/*
// 1. In your StudentBookingsPage or TutorBookingsPage:
const [cancelModalOpen, setCancelModalOpen] = useState(false);
const [selectedBooking, setSelectedBooking] = useState(null);

// 2. In your table component, call this function on button click:
<Button 
    onClick={() => {
        setSelectedBooking(booking);
        setCancelModalOpen(true);
    }}
>
    Cancel
</Button>

// 3. Render the dialog at the bottom of your page:
<CancellationDialog
    bookingId={selectedBooking?.id}
    isOpen={cancelModalOpen}
    onClose={() => setCancelModalOpen(false)}
    bookingDetails={selectedBooking}
/>
*/