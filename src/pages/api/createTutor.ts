/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { name, email, password } = req.body;

    try {
        const userRecord = await adminAuth.createUser({ email, password, displayName: name });
        await adminDb.collection("users").doc(userRecord.uid).set({ name, email, role: "tutor", createdAt: Date.now() });

        res.status(200).json({ uid: userRecord.uid });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}
