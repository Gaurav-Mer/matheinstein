import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from '@/lib/firebaseAdmin';
import { saveRazorpayKeys } from '@/lib/db';
import { encrypt } from '@/lib/crypto';

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

        const { keyId, keySecret } = req.body;
        if (!keyId || !keySecret) {
            return res.status(400).json({ error: 'Key ID and Key Secret are required.' });
        }

        const encryptedKeyId = encrypt(keyId);
        const encryptedKeySecret = encrypt(keySecret);

        await saveRazorpayKeys(uid, encryptedKeyId, encryptedKeySecret);

        res.status(200).json({ message: 'Razorpay account connected successfully.' });

    } catch (error) {
        console.error('Error connecting Razorpay account:', error);
        res.status(500).json({ error: 'Failed to connect Razorpay account' });
    }
}