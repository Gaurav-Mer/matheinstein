/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import TutorForm from "./TutorForm";

interface EditTutorDialogProps {
    tutor: any;
    open: boolean;
    onClose: () => void
}

export default function EditTutorDialog({ tutor, open, onClose }: EditTutorDialogProps) {
    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-[500px] h-dvh overflow-hidden flex flex-col">
                <SheetTitle className="shrink-0 p-4 pb-0 text-xl">Edit Tutor</SheetTitle>
                <TutorForm initialData={tutor} onClose={() => { onClose() }} />
            </SheetContent>
        </Sheet>
    );
}
