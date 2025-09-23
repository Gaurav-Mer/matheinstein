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

        // Get the user's email address
        const oauth2 = google.oauth2({ version: 'v2', auth: oAuth2Client });
        const userInfo = await oauth2.userinfo.get();
        const email = userInfo.data.email;

        if (!email) {
            throw new Error("Could not retrieve email from Google account.");
        }

        await saveTokens(userId, tokens, email);
        console.log(`Tokens saved successfully for user ${userId} with email ${email}.`);

        // Redirect back to the integrations page.
        res.redirect('/admin/apps-and-integrations');
    } catch (error) {
        console.error('Error retrieving access token or user info', error);
        res.redirect('/admin/apps-and-integrations?error=true');
    }
}
