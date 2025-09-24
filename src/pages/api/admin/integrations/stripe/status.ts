import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        const userDoc = await adminDb.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const userData = userDoc.data();
        const accountId = userData?.stripeAccountId;
        const onboardingComplete = userData?.stripeOnboardingComplete;

        if (accountId && onboardingComplete) {
            res.status(200).json({ connected: true, accountId: accountId });
        } else {
            res.status(200).json({ connected: false });
        }

    } catch (error) {
        console.error('Stripe status error:', error);
        res.status(500).json({ error: 'Failed to get Stripe connection status' });
    }
}
