/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/admin/admins.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { z } from "zod";

const updateAdminSchema = z.object({
    status: z.enum(["active", "inactive"]),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decoded = await adminAuth.verifyIdToken(token);
        const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
        if (userDoc.data()?.role !== "admin" && userDoc.data()?.role !== "super-admin") {
            return res.status(403).json({ error: "Forbidden: Not an admin." });
        }

        if (req.method === "GET") {
            const adminsSnapshot = await adminDb.collection("users").where(
                "role", "in", ["admin", "super-admin"]
            ).get();
            const admins = adminsSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
            return res.status(200).json(admins);
        }

        // PATCH to update admin status
        if (req.method === "PATCH") {
            const { uid, status } = req.body;
            if (!uid) return res.status(400).json({ error: "UID is required." });

            const validatedData = updateAdminSchema.parse({ status });

            await adminDb.collection("users").doc(uid).update({ status: validatedData.status });
            return res.status(200).json({ message: "Admin status updated successfully." });
        }

        // DELETE (hard delete)
        if (req.method === "DELETE") {
            const { uid } = req.body;
            if (!uid) return res.status(400).json({ error: "UID is required." });

            const targetUserDoc = await adminDb.collection("users").doc(uid).get();
            if (targetUserDoc.data()?.role === "super-admin") {
                return res.status(403).json({ error: "Forbidden: Cannot delete a super-admin." });
            }

            await adminAuth.deleteUser(uid);
            await adminDb.collection("users").doc(uid).delete();
            return res.status(200).json({ message: "Admin permanently deleted." });
        }

        res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({ error: "Invalid data provided", details: error.issues });
        }
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}