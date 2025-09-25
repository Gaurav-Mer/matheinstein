/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/bookings.ts (Conceptual addition)

import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { adminDb } from './firebaseAdmin';

export const addEventToExternalCalendar = async (tutorId: string, studentEmail: string, booking: any) => {
    // 1. Fetch Tutor's Tokens (from Firestore)
    const integrationDoc = await adminDb.collection("users").doc(tutorId)
        .collection("integrations").doc("googleCalendar").get();

    const tokens = integrationDoc.data()?.tokens;

    if (!tokens) return console.log(`Tutor ${tutorId} has no calendar connected.`);

    // 2. Configure Client
    const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );
    oAuth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    // 3. Create Event
    await calendar.events.insert({
        calendarId: 'primary', // Assumes 'primary' calendar
        requestBody: {
            summary: `Platform Lesson: ${booking.subject} with ${studentEmail}`,
            description: `Student: ${studentEmail}\nSubject: ${booking.subject}`,
            start: { dateTime: booking.startTime.toISOString() },
            end: { dateTime: booking.endTime.toISOString() },
            attendees: [
                { email: studentEmail },
                // Optionally add the platform's booking email here
            ],
            // Set guestsCanModify to false to ensure the booking remains locked
            guestsCanModify: false,
        },
    });
    console.log(`Event pushed successfully to Google Calendar for Tutor ${tutorId}.`);
};