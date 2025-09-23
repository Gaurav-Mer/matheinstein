import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';
import { saveTokens } from '@/lib/db';

const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID || 'YOUR_DUMMY_CLIENT_ID',
    process.env.GOOGLE_CLIENT_SECRET || 'YOUR_DUMMY_CLIENT_SECRET',
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/admin/integrations/google-calendar/callback'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { code, state } = req.query;

    if (typeof state !== 'string' || !state) {
        return res.status(400).json({ error: 'Missing state parameter (userId)' });
    }
    const userId = state;

    if (typeof code !== 'string' || !code) {
        return res.status(400).json({ error: 'Missing code parameter' });
    }

    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        await saveTokens(userId, tokens);
        console.log(`Tokens saved successfully for user ${userId}.`);

        // Example API call to Google Calendar
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
        const calendarList = await calendar.calendarList.list();
        console.log('User calendars:', calendarList.data.items);

        // Redirect back to the integrations page.
        res.redirect('/admin/apps-and-integrations');
    } catch (error) {
        console.error('Error retrieving access token or fetching calendar data', error);
        res.redirect('/admin/apps-and-integrations?error=true');
    }
}
