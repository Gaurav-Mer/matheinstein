import { NextApiRequest, NextApiResponse } from 'next';
import { getIntegrationData } from '@/lib/db';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { adminAuth } from '@/lib/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        const integrationData = await getIntegrationData(uid);
        if (!integrationData?.tokens) {
            return res.status(401).json({ error: 'Not connected to Google Calendar' });
        }

        const oAuth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID || 'YOUR_DUMMY_CLIENT_ID',
            process.env.GOOGLE_CLIENT_SECRET || 'YOUR_DUMMY_CLIENT_SECRET'
        );
        oAuth2Client.setCredentials(integrationData.tokens);

        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

        const now = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(now.getDate() + 7);

        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: now.toISOString(),
            timeMax: sevenDaysFromNow.toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });

        res.status(200).json(response.data.items);
    } catch (error) {
        console.error('Error fetching calendar events', error);
        res.status(500).json({ error: 'Failed to fetch calendar events' });
    }
}
