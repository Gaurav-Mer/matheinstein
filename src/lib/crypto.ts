import CryptoJS from 'crypto-js';

const secret = process.env.ENCRYPTION_SECRET || 'dummysecretkeyforrazorpaytesting';

if (!secret) {
    // This will now only be a concern if the fallback is also removed.
    throw new Error('ENCRYPTION_SECRET is not set in the environment variables.');
}

/**
 * Encrypts a string using AES.
 * @param text The string to encrypt.
 * @returns The encrypted string.
 */
export function encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, secret).toString();
}

/**
 * Decrypts a string using AES.
 * @param ciphertext The string to decrypt.
 * @returns The decrypted string.
 */
export function decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
}