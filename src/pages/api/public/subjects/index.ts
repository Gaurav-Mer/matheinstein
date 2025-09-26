// pages/api/public/subjects.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        // Fetch all subjects where status is 'active' (assuming you have a status field)
        const snapshot = await adminDb.collection("subjects").where("status", "==", "active").orderBy("name").get();
        const subjects = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));

        return res.status(200).json(subjects);

    } catch (error: any) {
        console.error("Public Subjects API error:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}