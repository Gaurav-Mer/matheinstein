/* eslint-disable @typescript-eslint/no-explicit-any */
// components/AvailabilitySection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";

// Reusable function to format time (e.g., from "09:00" to "9:00 AM")
const formatTime = (time: string) => {
    if (!time) return "N/A";
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return format(date, 'h:mm a');
};

interface AvailabilitySectionProps {
    availability: any[]; // Assuming availability is an array of objects
}

export default function AvailabilitySection({ availability }: AvailabilitySectionProps) {
    // Group slots by day
    const groupedAvailability = availability?.reduce((acc: any, slot: any) => {
        const day = slot.day;
        if (!acc[day]) {
            acc[day] = [];
        }
        acc[day].push(slot);
        return acc;
    }, {});

    const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                    <CalendarDays className="h-5 w-5 text-gray-600" />
                    Availability
                </CardTitle>
            </CardHeader>
            <CardContent>
                {availability?.length > 0 ? (
                    <ul className="space-y-4">
                        {daysOfWeek.map(day => (
                            <li key={day}>
                                <h4 className="font-semibold text-gray-700 capitalize mb-1">{day}</h4>
                                {groupedAvailability[day] && groupedAvailability[day].length > 0 ? (
                                    <ul className="space-y-1 text-gray-600">
                                        {groupedAvailability[day].map((slot: any, index: number) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <span>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 text-sm">Unavailable</p>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No availability set.</p>
                )}
            </CardContent>
        </Card>
    );
}