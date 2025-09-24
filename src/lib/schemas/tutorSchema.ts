// lib/schemas/tutorSchema.ts
import { z } from "zod";
// The structure of a single package/paid lesson
export const paidLessonSchema = z.object({
    id: z.string().optional(), // For internal tracking/deletion
    name: z.string().min(3, "Package name is required."), // e.g., "60 Minute Session"
    duration: z.number().int().min(15, "Min duration is 15 mins").max(180, "Max duration is 3 hours."), // in minutes
    price: z.number().min(0, "Price must be non-negative."), // Price per session/credit
    credits: z.number().int().min(1, "Must offer at least 1 credit.").max(30).optional(), // Number of credits in the package (optional, defaults to 1)
});


export const addTutorSchema = z.object({
    // Basic info
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().nullish(), // optional if admin creates without login
    phone: z.string().nullish(),
    bio: z.string().max(500).nullish(),

    // Tutor status
    status: z.string().nullish(),

    // Subjects tutor can teach
    subjects: z.array(z.string()).nullish(),

    // Availability: array of slots
    availability: z.array(
        z.object({
            day: z.string(),
            startTime: z.string(), // "09:00"
            endTime: z.string(),   // "17:00"
            slotDuration: z.number().min(15, "Minimum slot duration is 15 min").max(180, "Maximum slot is 3 hours"),
        }).nullish()
    ).nullish(),

    // Demo lesson config
    demoLesson: z.object({
        enabled: z.boolean().nullish(),
        duration: z.number().min(15).max(120).nullish(), // in minutes
        price: z.number().min(0).nullish(), // 0 for free demo
    }).nullish(),

    // Optional profile image
    profileImage: z.string().url().nullish(),

    // New: Time zone and buffer time
    timeZone: z.string().nullish(),
    bufferTime: z.number().int().min(0).max(120).nullish(),
    // New: Session duration controls
    sessionDuration: z.object({
        min: z.number().int().min(15).max(120),
        max: z.number().int().min(30).max(180),
    }).nullish(),

    // New: Booking window controls
    bookingWindow: z.object({
        minAdvanceNotice: z.number().int().min(1).max(24), // in hours
        maxAdvanceNotice: z.number().int().min(7).max(90), // in days
    }).nullish(),
    paidLessons: z.array(paidLessonSchema).nullish(), // Now strongly typed

});




export type AddTutorInput = z.infer<typeof addTutorSchema>;


export type DaysEnum = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";