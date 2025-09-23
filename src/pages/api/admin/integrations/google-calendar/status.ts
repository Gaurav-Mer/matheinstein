import { NextApiRequest, NextApiResponse } from 'next';
import { getIntegrationData } from '@/lib/db';
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

        if (integrationData) {
            res.status(200).json({ connected: true, email: integrationData.email });
        } else {
            res.status(200).json({ connected: false });
        }

    } catch (error) {
        console.error('Error getting connection status', error);
        res.status(500).json({ error: 'Failed to get connection status' });
    }
}
