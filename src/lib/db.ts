import { adminDb } from './firebaseAdmin';
import { Credentials } from 'google-auth-library';

const getIntegrationDocRef = (userId: string) =>
    adminDb.collection('users').doc(userId).collection('integrations').doc('googleCalendar');

/**
 * Saves the Google Calendar API tokens and connected email for a specific user in Firestore.
 * @param userId The ID of the user.
 * @param tokens The OAuth2 tokens to save.
 * @param email The email of the connected Google account.
 */
export async function saveTokens(userId: string, tokens: Credentials, email: string): Promise<void> {
    const docRef = getIntegrationDocRef(userId);
    await docRef.set({
        tokens,
        email,
        updatedAt: new Date().toISOString(),
    });
    console.log(`Tokens and email saved for user ${userId}`);
}

/**
 * Retrieves the Google Calendar integration data for a specific user from Firestore.
 * @param userId The ID of the user.
 * @returns The stored integration data (tokens and email), or null if not found.
 */
export async function getIntegrationData(userId: string): Promise<{ tokens: Credentials, email: string } | null> {
    const docRef = getIntegrationDocRef(userId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
        console.log(`No integration data found for user ${userId}`);
        return null;
    }

    const data = docSnap.data();
    if (!data?.tokens || !data?.email) {
        return null;
    }

    return {
        tokens: data.tokens,
        email: data.email,
    };
}

/**
 * Deletes the Google Calendar integration data for a specific user from Firestore.
 * @param userId The ID of the user.
 */
export async function deleteIntegrationData(userId: string): Promise<void> {
    const docRef = getIntegrationDocRef(userId);
    await docRef.delete();
    console.log(`Integration data deleted for user ${userId}`);
}
