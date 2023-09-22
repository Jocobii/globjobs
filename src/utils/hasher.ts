import crypto from 'crypto-js';

export const hashPassword = (str: string) => crypto.SHA256(str).toString();

export const hashGooglePassword = (str: string) => crypto.SHA1(str).toString();
