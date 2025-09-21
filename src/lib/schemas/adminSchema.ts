// lib/schemas/adminSchema.ts
import { z } from "zod";
import { addTutorSchema } from "./tutorSchema";

export const adminSchema = addTutorSchema.extend({
    role: z.string(),
    createdAt: z.string()?.nullish(),
    // We can add more admin-specific fields here later
});

export type AdminInput = z.infer<typeof adminSchema>;