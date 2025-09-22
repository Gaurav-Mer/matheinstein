// /* eslint-disable @typescript-eslint/no-explicit-any */
// // pages/api/tutor/earnings.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
// import { z } from "zod";

// const querySchema = z.object({
//     page: z.string().optional(),
//     limit: z.string().optional(),
//     // You could add filters like 'status', 'month', 'year' here
// }).optional();

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     if (req.method !== "GET") {
//         res.setHeader("Allow", ["GET"]);
//         return res.status(405).end(`Method ${req.method} Not Allowed`);
//     }

//     try {
//         // 1. Verify tutor token for security
//         const token = req.headers.authorization?.split(" ")[1];
//         if (!token) return res.status(401).json({ error: "Unauthorized" });
//         const decodedToken = await adminAuth.verifyIdToken(token);
//         const { uid } = decodedToken;

//         const tutorDoc = await adminDb.collection("users").doc(uid).get();
//         if (tutorDoc.data()?.role !== "tutor") return res.status(403).json({ error: "Forbidden" });

//         // 2. Fetch all payments/earnings for this tutor (placeholder)
//         // In a real app, you would have a 'payments' or 'transactions' collection
//         // and you would query it here. For now, we'll return mock data.

//         const earningsSnapshot = await adminDb
//             .collection("payments")
//             .where("tutorId", "==", uid)
//             .orderBy("createdAt", "desc")
//             .get();

//         const transactions:any = earningsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//         const totalEarnings = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
//         const pendingPayouts = transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);


//         return res.status(200).json({
//             totalEarnings,
//             pendingPayouts,
//             transactions,
//         });

//     } catch (error: any) {
//         if (error.name === "ZodError") {
//             return res.status(400).json({ error: "Invalid data provided", details: error.issues });
//         }
//         console.error("API error:", error);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// }