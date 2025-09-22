/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { id } = req.query;
        if (!id || typeof id !== "string") {
            return res.status(400).json({ error: "Tutor ID is required" });
        }

        const tutorDoc = await adminDb.collection("users").doc(id).get();
        if (!tutorDoc.exists || tutorDoc.data()?.role !== "tutor") {
            return res.status(404).json({ error: "Tutor not found" });
        }

        const tutorData = tutorDoc.data();

        // ⚠️ Only return public-facing data
        const publicTutorData = {
            uid: tutorDoc.id,
            name: tutorData?.name,
            bio: tutorData?.bio || "N/A",
            subjects: tutorData?.subjects || [],
            profileImage: tutorData?.profileImage || null,
            availability: tutorData?.availability || [],
            timeZone: tutorData?.timeZone || "UTC",
            bufferTime: tutorData?.bufferTime || 15,
            sessionDuration: tutorData?.sessionDuration || { min: 30, max: 60 },
            paidLessons: tutorData?.paidLessons || [],
        };

        return res.status(200).json(publicTutorData);
    } catch (error: any) {
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}