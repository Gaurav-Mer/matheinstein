/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/admin/students/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // 1️⃣ Verify the admin's token for security
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: Missing token" });
        }

        const decodedToken = await adminAuth.verifyIdToken(token);
        const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get();
        const userData = userDoc.data();

        // 2️⃣ Check for 'admin' role
        if (userData?.role !== "admin") {
            return res.status(403).json({ error: "Forbidden: Not an admin account" });
        }

        // 3️⃣ Handle GET request to fetch all students
        if (req.method === "GET") {
            res.setHeader("Cache-Control", "no-store"); // Ensure fresh data on every request

            const studentsSnapshot = await adminDb.collection("users").where("role", "==", "student").get();
            const students = studentsSnapshot.docs.map((doc) => ({
                uid: doc.id,
                ...doc.data(),
            }));

            return res.status(200).json(students);
        }

        // 4️⃣ Handle other methods (e.g., POST for creating a student)
        // This is a placeholder for future functionality
        if (req.method === "POST") {
            const { name, email } = req.body;
            if (!name || !email) {
                return res.status(400).json({ error: "Name and email are required" });
            }

            // Create user in Firebase Auth
            const newUser = await adminAuth.createUser({ email, displayName: name });

            // Save user data in Firestore
            await adminDb.collection("users").doc(newUser.uid).set({
                role: "student",
                name,
                email,
                createdAt: new Date().toISOString(),
            });

            return res.status(201).json({ uid: newUser.uid, email, name });
        }

        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);

    } catch (error: any) {
        console.error("API error:", error);
        if (error.code === "auth/email-already-exists") {
            return res.status(409).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}