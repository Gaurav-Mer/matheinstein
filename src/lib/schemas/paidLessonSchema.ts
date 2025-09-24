// lib/schemas/paidLessonSchema.ts (New file for clarity)
import { z } from "zod";

export const paidLessonSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3, "Package name is required."),
    duration: z.number().int().min(15).max(180), // Duration per session in the package
    price: z.number().min(0), // Price per session/credit (in INR)
    credits: z.number().int().min(1), // Number of sessions in this package
    currency: z.literal("INR").default("INR"), // Enforce INR as the base currency
});

export const purchaseRecordSchema = z.object({
    studentId: z.string(),
    tutorId: z.string(),
    packageId: z.string(),
    packageName: z.string(),
    creditsPurchased: z.number().int(),
    pricePerCreditINR: z.number(),
    totalAmountINR: z.number(),
    purchaseDate: z.date(),
    status: z.enum(['paid', 'pending', 'failed']).default('paid'),
});

export type PaidLessonPackage = z.infer<typeof paidLessonSchema>;
export type PurchaseRecord = z.infer<typeof purchaseRecordSchema>;