/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/tutor/students.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { z } from "zod";

const querySchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(["active", "inactive", "onboarding"]).optional(),
}).optional();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decodedToken = await adminAuth.verifyIdToken(token);
        const { uid } = decodedToken;

        const tutorDoc = await adminDb.collection("users").doc(uid).get();
        if (tutorDoc.data()?.role !== "tutor") return res.status(403).json({ error: "Forbidden" });

        const { page, limit, status } = querySchema.parse(req.query) || {};
        const pageNum = parseInt(page as string, 10) || 1;
        const limitNum = parseInt(limit as string, 10) || 20;

        let query: any = adminDb.collection("users").where("assignedTutorId", "==", uid);

        if (status) {
            query = query.where("status", "==", status);
        }

        const offset = (pageNum - 1) * limitNum;
        query = query.limit(limitNum).offset(offset);

        const studentsSnapshot = await query.get();
        const students = studentsSnapshot.docs.map((doc: any) => ({ uid: doc.id, ...doc.data() }));

        return res.status(200).json(students);

    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({ error: "Invalid data provided", details: error.issues });
        }
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}