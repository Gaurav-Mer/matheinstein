import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CreditCard, Video } from 'lucide-react';

const integrations = [
    {
        name: 'Google Calendar',
        description: 'Sync your calendar to manage bookings and availability.',
        icon: <Calendar className="h-8 w-8" />,
        connected: false,
    },
    {
        name: 'Stripe',
        description: 'Connect your Stripe account to process payments for bookings.',
        icon: <CreditCard className="h-8 w-8" />,
        connected: false,
    },
    {
        name: 'Google Meet',
        description: 'Automatically create Google Meet links for your bookings.',
        icon: <Video className="h-8 w-8" />,
        connected: false,
    },
];

const AppsAndIntegrations = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Apps & Integrations</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {integrations.map((integration) => (
                    <Card key={integration.name}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-4">
                                {integration.icon}
                                <CardTitle>{integration.name}</CardTitle>
                            </div>
                            <Button variant={integration.connected ? 'secondary' : 'default'}>
                                {integration.connected ? 'Manage' : 'Connect'}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{integration.description}</CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AppsAndIntegrations;
