import { adminDb } from './firebaseAdmin';
import { Credentials } from 'google-auth-library';

const getIntegrationDocRef = (userId: string) =>
    adminDb.collection('users').doc(userId).collection('integrations').doc('googleCalendar');

/**
 * Saves the Google Calendar API tokens for a specific user in Firestore.
 * @param userId The ID of the user.
 * @param tokens The OAuth2 tokens to save.
 */
export async function saveTokens(userId: string, tokens: Credentials): Promise<void> {
    const docRef = getIntegrationDocRef(userId);
    await docRef.set({
        tokens,
        updatedAt: new Date().toISOString(),
    });
    console.log(`Tokens saved for user ${userId}`);
}

/**
 * Retrieves the Google Calendar API tokens for a specific user from Firestore.
 * @param userId The ID of the user.
 * @returns The stored tokens, or null if not found.
 */
export async function getTokens(userId: string): Promise<Credentials | null> {
    const docRef = getIntegrationDocRef(userId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
        console.log(`No tokens found for user ${userId}`);
        return null;
    }

    const data = docSnap.data();
    return data?.tokens || null;
}
