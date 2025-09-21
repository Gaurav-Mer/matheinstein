import * as admin from "firebase-admin";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const databaseURL = process.env.FIREBASE_DATABASE_URL;

if (!admin.apps.length) {
    if (!projectId || !clientEmail || !privateKey || !databaseURL) {
        throw new Error("Firebase Admin SDK env vars missing");
    }

    admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
        databaseURL,
    });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminRealtimeDb = admin.database();
