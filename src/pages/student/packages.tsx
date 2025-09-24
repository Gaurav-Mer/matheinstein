"use client";
import React from 'react';
import StudentLayout from './_layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import api from '@/lib/axios';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY! || 'pk_test_51H5aH2K8zY9Q9Y8g7q6X5p4o3n2m1l0k9j8h7g6f5e4d3c2b1a0Z9Y8X7W6V5U4T3S2R1Q');

const dummyPackages = [
    { id: 'price_1', name: '5 Tutoring Sessions', price: 250, description: 'Get 5 hours of personalized tutoring.' },
    { id: 'price_2', name: '10 Tutoring Sessions', price: 450, description: 'Get 10 hours and save 10%.' },
    { id: 'price_3', name: '20 Tutoring Sessions', price: 800, description: 'Best value! Get 20 hours.' },
];

const CheckoutForm = () => {
    const handleCheckout = async (packageId: string) => {
        try {
            const { data } = await api.post('/student/create-checkout-session', {
                packageId,
            });
            const stripe = await stripePromise;
            if (stripe) {
                await stripe.redirectToCheckout({ sessionId: data.sessionId });
            }
        } catch (error) {
            console.error("Error redirecting to checkout", error);
        }
    };

    return (
        <div className="grid gap-8 md:grid-cols-3">
            {dummyPackages.map((pkg) => (
                <Card key={pkg.id}>
                    <CardHeader>
                        <CardTitle>{pkg.name}</CardTitle>
                        <CardDescription>{pkg.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center">
                        <p className="text-4xl font-bold mb-4">${pkg.price}</p>
                        <Button onClick={() => handleCheckout(pkg.id)}>Buy Now</Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

const PackagesPage = () => {
    return (
        <StudentLayout>
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">Buy Tutoring Packages</h1>
                <Elements stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            </div>
        </StudentLayout>
    );
};

export default PackagesPage;
