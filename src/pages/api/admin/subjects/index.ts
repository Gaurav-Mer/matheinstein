/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // 1️⃣ Verify token
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        const decoded = await adminAuth.verifyIdToken(token);

        // 2️⃣ Check if admin
        const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
        if (!userDoc.exists || userDoc.data()?.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        if (req.method === "GET") {
            // List all subjects
            const snapshot = await adminDb.collection("subjects").orderBy("name").get();
            const subjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return res.status(200).json(subjects);
        }

        if (req.method === "POST") {
            // Add new subject
            const { name, status } = req.body;
            if (!name) return res.status(400).json({ error: "Subject name is required" });

            const docRef = await adminDb.collection("subjects").add({
                name,
                status,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const newSubject = (await docRef.get()).data();
            return res.status(201).json({ id: docRef.id, ...newSubject });
        }

        return res.status(405).json({ error: "Method not allowed" });
    } catch (error: any) {
        console.error("Subjects API error:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}
