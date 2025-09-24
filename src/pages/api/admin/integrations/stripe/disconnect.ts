import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from '@/lib/firebaseAdmin';
import { deleteStripeIntegrationData, getStripeAccountId } from '@/lib/db';
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
            return res.status(404).json({ error: 'Stripe integration not found or already disconnected.' });
        }

        // Deleting the account on Stripe is a destructive action.
        // For this platform, we will just remove the connection from our side.
        // If you wanted to delete the account entirely, you would use:
        // await stripe.accounts.del(accountId);

        await deleteStripeIntegrationData(uid);

        res.status(200).json({ message: 'Successfully disconnected from Stripe.' });

    } catch (error) {
        console.error('Error disconnecting from Stripe', error);
        res.status(500).json({ error: 'Failed to disconnect from Stripe' });
    }
}
