import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from '@/lib/firebaseAdmin';
import { deleteRazorpayKeys } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        await deleteRazorpayKeys(uid);

        res.status(200).json({ message: 'Successfully disconnected from Razorpay.' });

    } catch (error) {
        console.error('Error disconnecting from Razorpay', error);
        res.status(500).json({ error: 'Failed to disconnect from Razorpay' });
    }
}