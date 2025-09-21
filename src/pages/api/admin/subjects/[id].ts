/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    if (!id || typeof id !== "string") return res.status(400).json({ error: "Subject ID is required" });

    try {
        // Verify token
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        const decoded = await adminAuth.verifyIdToken(token);

        // Check admin role
        const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
        if (!userDoc.exists || userDoc.data()?.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        if (req.method === "PUT") {
            const { name } = req.body;
            if (!name) return res.status(400).json({ error: "Subject name is required" });

            await adminDb.collection("subjects").doc(id).update({
                name,
                updatedAt: new Date(),
            });

            const updatedSubject = (await adminDb.collection("subjects").doc(id).get()).data();
            return res.status(200).json({ id, ...updatedSubject });
        }

        if (req.method === "DELETE") {
            await adminDb.collection("subjects").doc(id).delete();
            return res.status(200).json({ message: "Subject deleted successfully" });
        }

        return res.status(405).json({ error: "Method not allowed" });
    } catch (error: any) {
        console.error("Subjects API error:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}
