import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from '@/lib/firebaseAdmin';
import { getStripeAccountId, saveStripeAccountId } from '@/lib/db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        let accountId = await getStripeAccountId(uid);

        if (!accountId) {
            const account = await stripe.accounts.create({
                type: 'express',
            });
            accountId = account.id;
            await saveStripeAccountId(uid, accountId);
        }

        const returnUrl = `${req.headers.origin}/admin/apps-and-integrations?stripe_return=true`;
        const refreshUrl = `${req.headers.origin}/api/admin/integrations/stripe/connect`;

        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: refreshUrl,
            return_url: returnUrl,
            type: 'account_onboarding',
        });

        res.status(200).json({ url: accountLink.url });

    } catch (error) {
        console.error('Stripe Connect error:', error);
        res.status(500).json({ error: 'Failed to create Stripe connection link' });
    }
}
