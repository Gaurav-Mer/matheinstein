import { NextApiRequest, NextApiResponse } from 'next';
import { getIntegrationData, deleteIntegrationData } from '@/lib/db';
import { adminAuth } from '@/lib/firebaseAdmin';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        const integrationData = await getIntegrationData(uid);
        if (!integrationData?.tokens) {
            return res.status(404).json({ error: 'Integration not found or already disconnected.' });
        }

        // Revoke the token with Google
        const tokenToRevoke = integrationData.tokens.refresh_token || integrationData.tokens.access_token;
        if (tokenToRevoke) {
            try {
                await axios.post(`https://oauth2.googleapis.com/revoke?token=${tokenToRevoke}`);
                console.log('Token revoked successfully with Google.');
            } catch (revokeError) {
                // Log the error but don't block the disconnect process
                console.error('Failed to revoke token with Google. It might already be invalid.', revokeError);
            }
        }

        // Delete the tokens from our database
        await deleteIntegrationData(uid);

        res.status(200).json({ message: 'Successfully disconnected from Google Calendar.' });

    } catch (error) {
        console.error('Error disconnecting from Google Calendar', error);
        res.status(500).json({ error: 'Failed to disconnect from Google Calendar' });
    }
}
