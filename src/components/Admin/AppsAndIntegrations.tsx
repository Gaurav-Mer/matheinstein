"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, CreditCard, Video } from 'lucide-react';
import api from '@/lib/axios';
import { auth } from '@/lib/firebaseClient';

interface CalendarEvent {
    summary: string;
    start: {
        dateTime: string;
    };
    end: {
        dateTime: string;
    };
}

const integrations = [
    {
        name: 'Google Calendar',
        description: 'Sync your calendar to manage bookings and availability.',
        icon: <Calendar className="h-8 w-8" />,
        statusUrl: '/admin/integrations/google-calendar/status',
        connectUrl: '/api/admin/integrations/google-calendar',
        eventsUrl: '/admin/integrations/google-calendar/events',
    },
    {
        name: 'Stripe',
        description: 'Connect your Stripe account to process payments for bookings.',
        icon: <CreditCard className="h-8 w-8" />,
        statusUrl: '#',
        connectUrl: '#',
    },
    {
        name: 'Google Meet',
        description: 'Automatically create Google Meet links for your bookings.',
        icon: <Video className="h-8 w-8" />,
        statusUrl: '#',
        connectUrl: '#',
    },
];

const AppsAndIntegrations = () => {
    const [connectionStatus, setConnectionStatus] = useState<Record<string, boolean>>({});
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);

    useEffect(() => {
        const fetchStatus = async () => {
            const status: Record<string, boolean> = {};
            for (const integration of integrations) {
                if (integration.statusUrl !== '#') {
                    try {
                        const res = await api.get(integration.statusUrl);
                        status[integration.name] = res.data.connected;
                    } catch (error) {
                        console.error(`Failed to fetch status for ${integration.name}`, error);
                        status[integration.name] = false;
                    }
                }
            }
            setConnectionStatus(status);
        };
        fetchStatus();
    }, []);

    const handleConnect = async (url: string) => {
        if (!url || url === '#') return;
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not logged in");
            const token = await user.getIdToken();
            window.location.href = `${url}?token=${token}`;
        } catch (error) {
            console.error("Error getting auth token for connect URL", error);
        }
    };

    const handleFetchEvents = async (url: string) => {
        if (!url || url === '#') return;
        setIsLoadingEvents(true);
        try {
            const res = await api.get(url);
            setEvents(res.data);
        } catch (error) {
            console.error('Failed to fetch events', error);
        }
        setIsLoadingEvents(false);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Apps & Integrations</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {integrations.map((integration) => {
                    const isConnected = connectionStatus[integration.name];
                    return (
                        <Card key={integration.name}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {integration.icon}
                                    <CardTitle>{integration.name}</CardTitle>
                                </div>
                                {isConnected ? (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="secondary" onClick={() => handleFetchEvents(integration.eventsUrl || '#')}>
                                                Manage
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>{integration.name} Events</DialogTitle>
                                            </DialogHeader>
                                            {isLoadingEvents ? (
                                                <p>Loading events...</p>
                                            ) : (
                                                <ul>
                                                    {events.map((event, index) => (
                                                        <li key={index} className="mb-2">
                                                            <strong>{event.summary}</strong>
                                                            <p className="text-sm text-gray-500">
                                                                {new Date(event.start.dateTime).toLocaleString()} - {new Date(event.end.dateTime).toLocaleString()}
                                                            </p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                ) : (
                                    <Button onClick={() => handleConnect(integration.connectUrl)}>
                                        Connect
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{integration.description}</CardDescription>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default AppsAndIntegrations;
