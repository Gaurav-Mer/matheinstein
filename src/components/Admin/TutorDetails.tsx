/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTutor, useUpdateTutor } from "@/hooks/useTutors";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Loader2, Edit, User, MoveLeft, } from "lucide-react";
import EditTutorDialog from "./EditTutor";
import { AddTutorInput } from "@/lib/schemas/tutorSchema";
import AvailabilitySection from "../tutor/AvailabilitySection";
import TutorInfoCard from "../tutor/TutorInfoCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentsTab from "../tutor/StudentsTab";
import AvailabilityTab from "../tutor/AvailabilityTab";

interface TutorDetailsProps {
    tutorId?: string; // optional, for tutor self view
    canEdit: boolean; // true for admin
}

export default function TutorDetails({ tutorId, canEdit }: TutorDetailsProps) {
    const params = useParams();
    const id = tutorId ?? params?.id ?? ""; // fallback to route param
    const router = useRouter()
    const { data: tutor, isLoading } = useTutor(id as string);
    const { mutate: updateTutor, isPending: isUpdating } = useUpdateTutor();
    const [activeTab, setActiveTab] = useState("students");



    const [showEdit, setShowEdit] = useState(false);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    if (!tutor) {
        return <p className="text-center text-gray-500 mt-8">Tutor not found.</p>;
    }

    const handleStatusToggle = () => {
        const newStatus = tutor.status === "active" ? "inactive" : "active";
        updateTutor(
            { uid: tutor.uid, status: newStatus },
            {
                onSuccess: () => toast.success(`Tutor status updated to ${newStatus}!`),
                onError: () => toast.error("Failed to update status"),
            }
        );
    };

    return (
        <div className="space-y-4 p-6 lg:p-10 bg-white min-h-screen">
            {/* Header */}
            <div onClick={() => canEdit ? router.push("/admin/tutors") : router.push("/")} className="flex items-center gap-2 cursor-pointer text-secondary/80" >
                <MoveLeft />
                <p>Back </p>
            </div>
            <div className="flex items-center justify-between border rounded-2xl p-4 bg-white" >
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-secondary/20 text-secondary">
                        <User className="h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{tutor.name}</h1>
                        <p className="text-gray-500">{tutor.email}</p>
                    </div>
                </div>
                {canEdit && (
                    <Button onClick={() => setShowEdit(true)} className="gap-2 px-6 py-3">
                        <Edit className="h-4 w-4" />
                        Edit Tutor
                    </Button>
                )}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
                {/* Left Column: Info, Subjects */}
                <div className="lg:col-span-2 space-y-8">
                    <TutorInfoCard tutor={tutor} canEdit={canEdit} handleStatusToggle={handleStatusToggle} isUpdating={isUpdating} />
                </div>

                {/* Right Column: Availability */}
                <div className="lg:col-span-6 flex flex-col gap-3">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            {/* <TabsTrigger value="upcoming">Upcoming meetings</TabsTrigger> */}
                            <TabsTrigger value="students">Students</TabsTrigger>
                            <TabsTrigger value="availability">
                                Booking & Availability
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    {activeTab === "availability" && <AvailabilityTab tutor={tutor} canEdit />}
                    {activeTab === "students" && <StudentsTab tutor={tutor} canEdit />}
                </div>
            </div>

            {/* Edit Dialog */}
            {canEdit && showEdit && (
                <EditTutorDialog
                    tutor={tutor as AddTutorInput}
                    open={showEdit}
                    onClose={() => setShowEdit(false)}
                />
            )}
        </div>
    );
}