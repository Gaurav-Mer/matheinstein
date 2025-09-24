import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from '@/lib/firebaseAdmin';
import { getStripeAccountId, setStripeOnboardingComplete } from '@/lib/db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
});

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

        const accountId = await getStripeAccountId(uid);
        if (!accountId) {
            return res.status(404).json({ error: 'Stripe account not found.' });
        }

        const account = await stripe.accounts.retrieve(accountId);

        if (account.details_submitted) {
            await setStripeOnboardingComplete(uid);
            return res.status(200).json({ message: 'Stripe onboarding finalized.' });
        } else {
            return res.status(400).json({ error: 'Stripe onboarding not complete.' });
        }

    } catch (error) {
        console.error('Stripe return error:', error);
        res.status(500).json({ error: 'Failed to finalize Stripe connection' });
    }
}
