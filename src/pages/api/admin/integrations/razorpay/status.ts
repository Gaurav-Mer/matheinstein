import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from '@/lib/firebaseAdmin';
import { getRazorpayKeys } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        const keys = await getRazorpayKeys(uid);

        if (keys) {
            res.status(200).json({ connected: true });
        } else {
            res.status(200).json({ connected: false });
        }

    } catch (error) {
        console.error('Error getting Razorpay status:', error);
        res.status(500).json({ error: 'Failed to get Razorpay connection status' });
    }
}