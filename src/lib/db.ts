import fs from 'fs/promises';
import path from 'path';
import { Credentials } from 'google-auth-library';

const dbPath = path.resolve(process.cwd(), 'db.json');

interface DbData {
    googleCalendar: {
        tokens: Credentials | null;
    };
}

async function readDb(): Promise<DbData> {
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist, return a default structure
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { googleCalendar: { tokens: null } };
        }
        throw error;
    }
}

async function writeDb(data: DbData): Promise<void> {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

export async function saveTokens(tokens: Credentials): Promise<void> {
    const db = await readDb();
    db.googleCalendar.tokens = tokens;
    await writeDb(db);
}

export async function getTokens(): Promise<Credentials | null> {
    const db = await readDb();
    return db.googleCalendar.tokens;
}
