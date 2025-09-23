import { NextApiRequest, NextApiResponse } from 'next';
import { getTokens } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const tokens = await getTokens();
        if (tokens) {
            res.status(200).json({ connected: true });
        } else {
            res.status(200).json({ connected: false });
        }
    } catch (error) {
        console.error('Error reading tokens from db', error);
        res.status(500).json({ error: 'Failed to get connection status' });
    }
}
