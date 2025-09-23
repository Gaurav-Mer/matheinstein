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

interface ConnectionStatus {
    connected: boolean;
    email?: string;
}

const integrations = [
    {
        name: 'Google Calendar',
        description: 'Sync your calendar to manage bookings and availability.',
        icon: <Calendar className="h-8 w-8" />,
        statusUrl: '/admin/integrations/google-calendar/status',
        connectUrl: '/api/admin/integrations/google-calendar',
        eventsUrl: '/admin/integrations/google-calendar/events',
        disconnectUrl: '/admin/integrations/google-calendar/disconnect',
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
    const [connectionStatus, setConnectionStatus] = useState<Record<string, ConnectionStatus>>({});
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);
    const [eventsError, setEventsError] = useState<string | null>(null);
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);

    const fetchStatus = async () => {
        const status: Record<string, ConnectionStatus> = {};
        for (const integration of integrations) {
            if (integration.statusUrl !== '#') {
                try {
                    const res = await api.get(integration.statusUrl);
                    status[integration.name] = res.data;
                } catch (error) {
                    console.error(`Failed to fetch status for ${integration.name}`, error);
                    status[integration.name] = { connected: false };
                }
            }
        }
        setConnectionStatus(status);
    };

    useEffect(() => {
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
        setEventsError(null);
        setEvents([]);
        try {
            const res = await api.get(url);
            if (res.data && res.data.length > 0) {
                setEvents(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch events', error);
            setEventsError('Failed to fetch calendar events. Please try again.');
        }
        setIsLoadingEvents(false);
    };

    const handleDisconnect = async (url: string) => {
        if (!url || url === '#') return;
        setIsDisconnecting(true);
        try {
            await api.post(url);
            await fetchStatus(); // Refetch status to update UI
            setIsManageDialogOpen(false); // Close dialog on success
        } catch (error) {
            console.error('Failed to disconnect', error);
            // Optionally, show an error message to the user
        }
        setIsDisconnecting(false);
    };

    const renderEventsContent = () => {
        if (isLoadingEvents) {
            return <p>Loading events...</p>;
        }
        if (eventsError) {
            return <p className="text-red-500">{eventsError}</p>;
        }
        if (events.length === 0) {
            return <p>No upcoming events found in the next 7 days.</p>;
        }
        return (
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
        );
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Apps & Integrations</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {integrations.map((integration) => {
                    const status = connectionStatus[integration.name] || { connected: false };
                    return (
                        <Card key={integration.name}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {integration.icon}
                                    <CardTitle>{integration.name}</CardTitle>
                                </div>
                                {status.connected ? (
                                    <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="secondary" onClick={() => handleFetchEvents(integration.eventsUrl || '#')}>
                                                Manage
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>{integration.name} Events</DialogTitle>
                                            </DialogHeader>
                                            <div className="py-4">{renderEventsContent()}</div>
                                            <Button
                                                variant="destructive"
                                                onClick={() => handleDisconnect(integration.disconnectUrl || '#')}
                                                disabled={isDisconnecting}
                                            >
                                                {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
                                            </Button>
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
                                {status.connected && status.email && (
                                    <div className="mt-4 text-sm text-gray-600">
                                        Connected as: <strong>{status.email}</strong>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default AppsAndIntegrations;
