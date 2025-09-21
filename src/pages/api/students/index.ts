/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        // 1️⃣ Get the token from Authorization header
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        // 2️⃣ Verify the token and get the user's UID
        const decodedToken = await adminAuth.verifyIdToken(token);
        const { uid } = decodedToken;

        // 3️⃣ Fetch the user's document from Firestore
        const userDoc = await adminDb.collection("users").doc(uid).get();

        // 4️⃣ Check if the user exists and has the 'student' role
        if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

        const userData = userDoc.data();
        if (userData?.role !== "student") {
            return res.status(403).json({ error: "Forbidden: Not a student account" });
        }

        // 5️⃣ Return the student's profile data
        return res.status(200).json({ uid: userDoc.id, ...userData });

    } catch (error: any) {
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}