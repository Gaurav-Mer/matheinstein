"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface TutorBirdDialogProps {
    open: boolean;
    onClose: () => void;
}

const TutorBirdDialog: React.FC<TutorBirdDialogProps> = ({ open, onClose }) => {
    React.useEffect(() => {
        if (!open) return; // Only load when dialog opens

        const script = document.createElement("script");
        script.src =
            "https://app.tutorbird.com/Widget/v4/Widget.ashx?settings=eyJTY2hvb2xJRCI6InNjaF9ZOGhKRCIsIldlYnNpdGVJRCI6Indic181TmJKeCIsIldlYnNpdGVCbG9ja0lEIjoid2JiX05UN0xKcSJ9"; // replace with your actual ID
        script.async = true;
        script.defer = true;

        const container = document.getElementById("tutorbird-widget");
        if (container) {
            container.innerHTML = ""; // clear previous
            container.appendChild(script);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
                <DialogHeader className="bg-primary text-white py-6 text-center">
                    <DialogTitle className="text-3xl md:text-5xl font-extrabold">Select Slot</DialogTitle>
                    <DialogDescription className="text-xl md:text-2xl mt-2">
                        Pick your preferred date and time to book your session
                    </DialogDescription>
                </DialogHeader>

                <div id="tutorbird-widget" className="p-6"></div>
            </DialogContent>
        </Dialog>
    );
};

export default TutorBirdDialog;
