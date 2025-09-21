// lib/schemas/studentSchema.ts
import { z } from "zod";

export const addStudentSchema = z.object({
    // Basic info
    name: z.string().min(2, "Name is required."),
    email: z.string().email("Invalid email address."),
    password: z.string().nullish(),
    phone: z.string().nullish(),

    // Subjects they are learning
    subjects: z.array(z.string()).nullish(),

    // Internal status for admin
    status: z.enum(["active", "inactive", "onboarding"]).default("onboarding").optional(),

    // Optional profile picture
    profileImage: z.string().url("Invalid URL").nullish(),

    // Tutor assigned to them
    assignedTutorId: z.string().nullish(),

    // New: Parent/Guardian Details
    parentDetails: z.object({
        name: z.string().min(2, "Parent's name is required.").optional(),
        email: z.string().email("Invalid parent email address.").optional(),
        phone: z.string().nullish(),
    }).optional(),

    // New: Address Details
    address: z.object({
        country: z.string().nullish(),
        state: z.string().nullish(),
        city: z.string().nullish(),
        street: z.string().nullish(),
    }).nullish(),

});

export type AddStudentInput = z.infer<typeof addStudentSchema>;