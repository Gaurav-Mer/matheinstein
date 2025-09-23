import { OAuth2Client } from 'google-auth-library';
import { NextApiRequest, NextApiResponse } from 'next';

const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID || 'YOUR_DUMMY_CLIENT_ID',
    process.env.GOOGLE_CLIENT_SECRET || 'YOUR_DUMMY_CLIENT_SECRET',
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/admin/integrations/google-calendar/callback'
);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/calendar',
    });
    res.redirect(authorizeUrl);
}
