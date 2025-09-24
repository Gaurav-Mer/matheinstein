import { OAuth2Client } from 'google-auth-library';
import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from '@/lib/firebaseAdmin';

const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID || 'YOUR_DUMMY_CLIENT_ID',
    process.env.GOOGLE_CLIENT_SECRET || 'YOUR_DUMMY_CLIENT_SECRET',
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/admin/integrations/google-calendar/callback'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: Missing token" });
        }

        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/calendar',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
            ],
            state: uid,
        });

        // Instead of a redirect, return the URL to the client
        res.status(200).json({ url: authorizeUrl });

    } catch (error) {
        console.error("Error generating auth URL", error);
        res.status(500).json({ error: "Failed to initiate Google authentication" });
    }
}
