/* eslint-disable @typescript-eslint/no-explicit-any */
// components/SubjectsSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

interface SubjectsSectionProps {
    subjects: any[]; // Assuming subjects is an array of objects with a name property
}

export default function SubjectsSection({ subjects }: SubjectsSectionProps) {
    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                    <BookOpen className="h-5 w-5 text-gray-600" />
                    Subjects
                </CardTitle>
            </CardHeader>
            <CardContent>
                {subjects?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {subjects.map((sub: any) => (
                            <Badge key={sub.id} variant="secondary">
                                {sub.name}
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