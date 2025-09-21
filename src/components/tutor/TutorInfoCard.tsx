/* eslint-disable @typescript-eslint/no-explicit-any */
// components/TutorInfoCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Info } from "lucide-react";
import { useSubjects } from "@/hooks/useSubjects";
import { normalizeArray } from "@/lib/utils";

interface TutorInfoCardProps {
    tutor: any; // Use a proper type if available
    canEdit: boolean;
    handleStatusToggle: () => void;
    isUpdating: boolean;
}

export default function TutorInfoCard({ tutor, canEdit, handleStatusToggle, isUpdating }: TutorInfoCardProps) {
    const { data: allSubjects = [], isLoading: isSubjectLoading } = useSubjects();
    if (isSubjectLoading) return <>loading...</>

    const normalizeSubject = normalizeArray(allSubjects || [], "id")

    return (
        <Card className="shadow-none">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                    <Info className="h-5 w-5 text-gray-600" />
                    Tutor Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-gray-800">{tutor.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-gray-800">{tutor.phone || "N/A"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Info className="h-5 w-5 text-gray-500" />
                    <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <Badge
                            variant={tutor.status === "active" ? "default" : "secondary"}
                            className="cursor-pointer capitalize"
                            onClick={canEdit ? handleStatusToggle : undefined}
                        >
                            {tutor.status}
                        </Badge>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Bio</p>
                    <p className="text-gray-800">{tutor.bio || "No bio provided."}</p>
                </div>

                {tutor?.subjects?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {tutor?.subjects.map((sub: any) => (
                            <Badge key={sub.id} variant="secondary">
                                {normalizeSubject[sub]?.name}
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No subjects assigned.</p>
                )}
            </CardContent>
        </Card>
    );
}