'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import TutorForm from "./TutorForm";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";


export default function AddTutorDialog({ trigger }: { trigger?: React.ReactNode }) {
    const [open, setOpen] = useState(false); // control dialog open state

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {trigger || (
                    <Button className="gap-2">
                        <UserPlus className="h-4 w-4" /> Add Tutor
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent className="sm:max-w-[500px] h-dvh overflow-hidden flex flex-col">
                <SheetTitle className="shrink-0 p-4 pb-0 text-xl"  >Add New Tutor</SheetTitle>
                <TutorForm onClose={() => setOpen(false)} /> {/* close dialog on success */}
            </SheetContent>
        </Sheet>
    );
}
