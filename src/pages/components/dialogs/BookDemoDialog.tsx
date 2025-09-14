"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import Script from "next/script";

interface IProps {
    open: boolean;
    onClose: () => void;
}

export default function BookDemoDialog({ open, onClose }: IProps) {
    console.log("open", open)
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl rounded-2xl p-0 overflow-hidden">
                {/* Header */}
                <DialogHeader className="px-6 pt-6 pb-3 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-bold text-gray-800">
                                Book Your Free Demo
                            </DialogTitle>
                            <DialogDescription className="text-gray-500 text-sm">
                                Pick a subject, tutor, and time slot that works best for you.
                            </DialogDescription>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
