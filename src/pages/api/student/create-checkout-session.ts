import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
});

// This should be in a shared location or a database
const dummyPackages = [
    { id: 'price_1', name: '5 Tutoring Sessions', priceInCents: 25000 },
    { id: 'price_2', name: '10 Tutoring Sessions', priceInCents: 45000 },
    { id: 'price_3', name: '20 Tutoring Sessions', priceInCents: 80000 },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        // 1. Authenticate the student making the request
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        await adminAuth.verifyIdToken(token);

        // 2. Get the package info from the request
        const { packageId } = req.body;
        const selectedPackage = dummyPackages.find(p => p.id === packageId);
        if (!selectedPackage) {
            return res.status(400).json({ error: "Invalid package selected." });
        }

        // 3. Find the admin's Stripe account ID
        // TODO: This assumes a single admin. In a multi-admin setup, you'd need a more robust way
        // to determine which admin's Stripe account to use.
        const adminQuery = await adminDb.collection('users').where('role', '==', 'admin').limit(1).get();
        if (adminQuery.empty) {
            return res.status(500).json({ error: "Admin account not found." });
        }
        const adminData = adminQuery.docs[0].data();
        const adminStripeAccountId = adminData.stripeAccountId;

        if (!adminStripeAccountId) {
            return res.status(500).json({ error: "Admin has not connected their Stripe account." });
        }

        // 4. Create a Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: selectedPackage.name,
                        },
                        unit_amount: selectedPackage.priceInCents,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}/student/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/student/payment-cancelled`,
            payment_intent_data: {
                // This is the key part for Stripe Connect
                transfer_data: {
                    destination: adminStripeAccountId,
                },
            },
        });

        res.status(200).json({ sessionId: session.id });

    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
}
