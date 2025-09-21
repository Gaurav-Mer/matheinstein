/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
// /lib/middleware.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "firebase-admin/auth";

export async function adminOnly(req: NextApiRequest, res: NextApiResponse, next: Function) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        const decoded = await getAuth().verifyIdToken(token);
        if (decoded.role !== "admin") return res.status(403).json({ error: "Forbidden" });

        // attach uid for later use
        (req as any).uid = decoded.uid;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized" });
    }
}
