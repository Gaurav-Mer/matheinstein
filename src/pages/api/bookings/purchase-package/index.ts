/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/student/purchase-package.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { z } from "zod";
import { PaidLessonPackage, PurchaseRecord, paidLessonSchema } from "@/lib/schemas/paidLessonSchema";

// Define the fallback rate for calculation (as defined in Tutor Schema)
const DEFAULT_PAYOUT_PERCENTAGE = 70;

// Schema for the incoming request body
const purchaseInputSchema = z.object({
    tutorId: z.string().min(1, "Tutor ID is required."),
    packageData: paidLessonSchema,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decodedToken = await adminAuth.verifyIdToken(token);
        const { uid: studentId } = decodedToken;

        const { tutorId, packageData } = purchaseInputSchema.parse(req.body);
        const totalAmountINR = packageData.price * packageData.credits;

        // 1. Fetch Tutor's Profile to get their custom payout rate (OUTSIDE TRANSACTION)
        const tutorDoc = await adminDb.collection('users').doc(tutorId).get();
        const tutorData = tutorDoc.data();
        if (!tutorData) throw new Error("Tutor profile not found.");

        // Calculate the locked-in payout rate (e.g., 70% of gross price)
        const payoutPercent = tutorData.payoutPercentage || DEFAULT_PAYOUT_PERCENTAGE;

        // 🌟 CRITICAL CALCULATION: Lock in the NET PAYOUT value per credit 🌟
        const netPayoutPerCreditINR = Math.round(packageData.price * (payoutPercent / 100));


        // 2. START SECURE TRANSACTION
        await adminDb.runTransaction(async (t) => {
            const studentRef = adminDb.collection('users').doc(studentId);
            const studentSnap = await t.get(studentRef);

            if (!studentSnap.exists) {
                throw new Error("Student profile not found.");
            }

            const currentCredits = studentSnap.data()?.lessonCredits || 0;
            const newCredits = currentCredits + packageData.credits;

            // Define the auditable purchase record
            const purchaseRecord: PurchaseRecord = {
                studentId,
                tutorId,
                packageId: packageData.id || `pkg_${Date.now()}`,
                packageName: packageData.name,
                creditsPurchased: packageData.credits,
                pricePerCreditINR: packageData.price, // Student's Gross Cost (Revenue Lock-in)
                tutorNetPayoutPerCredit: netPayoutPerCreditINR, // ⬅️ Company's Cost (Payout Lock-in)
                totalAmountINR,
                purchaseDate: new Date(),
                status: "paid", // Assumes successful payment simulation
            };

            // a) Update student's credit balance atomically
            t.update(studentRef, { lessonCredits: newCredits });

            // b) Create the auditable purchase record
            t.set(adminDb.collection('purchases').doc(), purchaseRecord);
        });

        // 3. Return success message
        return res.status(201).json({ message: "Package purchased and credits added.", creditsAdded: packageData.credits });

    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({ error: "Invalid data provided", details: error.issues });
        }
        if (error.message.includes("Student profile not found")) {
            return res.status(404).json({ error: error.message });
        }
        console.error("Purchase API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}