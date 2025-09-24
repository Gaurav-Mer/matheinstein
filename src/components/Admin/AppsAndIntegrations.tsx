"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, CreditCard, Video } from 'lucide-react';
import api from '@/lib/axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { RazorpayConnectDialog } from './RazorpayConnectDialog';

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
    accountId?: string;
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
        statusUrl: '/admin/integrations/stripe/status',
        connectUrl: '/api/admin/integrations/stripe/connect',
        disconnectUrl: '/admin/integrations/stripe/disconnect',
    },
    {
        name: 'Google Meet',
        description: 'Automatically create Google Meet links for your bookings.',
        icon: <Video className="h-8 w-8" />,
        statusUrl: '#',
        connectUrl: '#',
    },
    {
        name: 'Razorpay',
        description: 'Connect your Razorpay account to process payments.',
        icon: <CreditCard className="h-8 w-8" />,
        statusUrl: '/admin/integrations/razorpay/status',
        connectUrl: '#', // Handled by dialog
        disconnectUrl: '/admin/integrations/razorpay/disconnect',
    },
];

const AppsAndIntegrations = () => {
    const [connectionStatus, setConnectionStatus] = useState<Record<string, ConnectionStatus>>({});
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);
    const [eventsError, setEventsError] = useState<string | null>(null);
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const [isManageDialogOpen, setIsManageDialogOpen] = useState<Record<string, boolean>>({});
    const [isConnecting, setIsConnecting] = useState<Record<string, boolean>>({});

    const searchParams = useSearchParams();
    const router = useRouter();

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
        if (searchParams.get('stripe_return')) {
            api.post('/admin/integrations/stripe/return').then(() => {
                router.replace('/admin/apps-and-integrations');
                fetchStatus();
            });
        } else {
            fetchStatus();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const handleConnect = async (name: string, url: string) => {
        if (!url || url === '#') return;
        setIsConnecting({ ...isConnecting, [name]: true });
        try {
            const res = await api.get(url);
            if (res.data.url) {
                window.location.href = res.data.url;
            }
        } catch (error) {
            console.error(`Error creating connect link for ${name}`, error);
        }
        setIsConnecting({ ...isConnecting, [name]: false });
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

    const handleDisconnect = async (integrationName: string, url: string) => {
        if (!url || url === '#') return;
        setIsDisconnecting(true);
        try {
            await api.post(url);
            await fetchStatus();
            setIsManageDialogOpen({ ...isManageDialogOpen, [integrationName]: false });
        } catch (error) {
            console.error('Failed to disconnect', error);
        }
        setIsDisconnecting(false);
    };

    const handleOpenManageDialog = (integrationName: string, eventsUrl?: string) => {
        if (integrationName === 'Google Calendar' && eventsUrl) {
            handleFetchEvents(eventsUrl);
        }
        setIsManageDialogOpen({ ...isManageDialogOpen, [integrationName]: true });
    };

    const renderManageContent = (integrationName: string, status: ConnectionStatus) => {
        if (integrationName === 'Google Calendar') {
            return (
                <>
                    <DialogHeader>
                        <DialogTitle>{integrationName} Events</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        {isLoadingEvents ? <p>Loading events...</p> :
                         eventsError ? <p className="text-red-500">{eventsError}</p> :
                         events.length === 0 ? <p>No upcoming events found in the next 7 days.</p> :
                         <ul>
                            {events.map((event, index) => (
                                <li key={index} className="mb-2">
                                    <strong>{event.summary}</strong>
                                    <p className="text-sm text-gray-500">
                                        {new Date(event.start.dateTime).toLocaleString()} - {new Date(event.end.dateTime).toLocaleString()}
                                    </p>
                                </li>
                            ))}
                        </ul>}
                    </div>
                </>
            );
        }
        if (integrationName === 'Stripe') {
            return (
                <DialogHeader>
                    <DialogTitle>{integrationName} Connected</DialogTitle>
                    <CardDescription>Your account {status.accountId} is connected and ready to process payments.</CardDescription>
                </DialogHeader>
            );
        }
        if (integrationName === 'Razorpay') {
            return (
                <DialogHeader>
                    <DialogTitle>{integrationName} Connected</DialogTitle>
                    <CardDescription>Your Razorpay account is connected.</CardDescription>
                </DialogHeader>
            );
        }
        return null;
    };

    const renderConnectButton = (integration: typeof integrations[0]) => {
        const { name, connectUrl } = integration;

        if (name === 'Razorpay') {
            return <RazorpayConnectDialog onConnectionSuccess={fetchStatus} />;
        }

        return (
            <Button onClick={() => handleConnect(name, connectUrl)} disabled={isConnecting[name]}>
                {isConnecting[name] ? 'Connecting...' : 'Connect'}
            </Button>
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
                                    <Dialog open={isManageDialogOpen[integration.name]} onOpenChange={(isOpen) => setIsManageDialogOpen({ ...isManageDialogOpen, [integration.name]: isOpen })}>
                                        <DialogTrigger asChild>
                                            <Button variant="secondary" onClick={() => handleOpenManageDialog(integration.name, integration.eventsUrl)}>
                                                Manage
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            {renderManageContent(integration.name, status)}
                                            <Button
                                                variant="destructive"
                                                onClick={() => handleDisconnect(integration.name, integration.disconnectUrl || '#')}
                                                disabled={isDisconnecting}
                                            >
                                                {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
                                            </Button>
                                        </DialogContent>
                                    </Dialog>
                                ) : (
                                    renderConnectButton(integration)
                                )}
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{integration.description}</CardDescription>
                                {status.connected && status.email && (
                                    <div className="mt-4 text-sm text-gray-600">
                                        Connected as: <strong>{status.email}</strong>
                                    </div>
                                )}
                                {status.connected && status.accountId && (
                                    <div className="mt-4 text-sm text-gray-600">
                                        Account ID: <strong>{status.accountId}</strong>
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