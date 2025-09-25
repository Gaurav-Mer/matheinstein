/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/admin/demo-requests/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { z } from "zod";
// ... (email/nodemailer imports would be here) ...

const assignTutorSchema = z.object({
    tutorId: z.string().min(1, "Tutor ID is required."),
});

// Assuming sendEmail function is defined with full logic
const sendEmail = async (subject: string, to: string, html: string) => { /* ... */ };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PATCH") {
        res.setHeader("Allow", ["PATCH"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { id } = req.query;
        if (!id || typeof id !== "string") {
            return res.status(400).json({ error: "Demo request ID is required." });
        }
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decodedToken = await adminAuth.verifyIdToken(token);
        const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get();
        if (userDoc.data()?.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }
        const { tutorId } = assignTutorSchema.parse(req.body);
        const demoRequestRef = adminDb.collection("demoRequests").doc(id);
        const demoRequestDoc = await demoRequestRef.get();
        if (!demoRequestDoc.exists || demoRequestDoc.data()?.status !== "unassigned") {
            return res.status(404).json({ error: "Demo request not found or already assigned." });
        }

        const demoRequestData = demoRequestDoc.data();
        const studentId = demoRequestData?.studentId;
        const subjectId = demoRequestData?.subjectId; // ⬅️ Get the ID

        // 1. Fetch all necessary data
        const [tutorDoc, studentDoc, subjectDoc] = await Promise.all([
            adminDb.collection("users").doc(tutorId).get(),
            adminDb.collection("users").doc(studentId).get(),
            adminDb.collection("subjects").doc(subjectId).get(), // ⬅️ Fetch Subject details
        ]);

        if (!tutorDoc.exists || !studentDoc.exists || !subjectDoc.exists) {
            return res.status(404).json({ error: "Tutor, student, or subject data not found." });
        }

        // 2. Update DB and Create Booking
        await demoRequestRef.update({ status: "assigned", tutorId, assignedAt: new Date() });
        const bookingRef = adminDb.collection("bookings").doc();
        await bookingRef.set({ ...demoRequestData, id: bookingRef.id, tutorId, status: "upcoming", createdAt: new Date() });

        // 3. Prepare for Email
        const tutorName = tutorDoc.data()?.name;
        const studentName = studentDoc.data()?.name;
        const studentEmail = studentDoc.data()?.email;
        const tutorEmail = tutorDoc.data()?.email;
        const subjectName = subjectDoc.data()?.name; // ⬅️ Use the name for the email

        const studentEmailHtml = `<p>Hi ${studentName}, Your demo for ${subjectName} has been assigned to your new tutor, ${tutorName}.</p>`;
        const tutorEmailHtml = `<p>Hi ${tutorName}, A new demo session for ${subjectName} has been assigned to you. Student: ${studentName}.</p>`;

        // 4. Send Emails
        await sendEmail("Demo Session Assigned!", studentEmail, studentEmailHtml);
        await sendEmail("New Demo Session Assigned", tutorEmail, tutorEmailHtml);

        return res.status(200).json({ message: "Tutor assigned and booking created successfully." });

    } catch (error: any) {
        if (error.name === "ZodError") return res.status(400).json({ error: "Invalid data provided", details: error.issues });
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}