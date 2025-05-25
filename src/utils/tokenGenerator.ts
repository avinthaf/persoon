import { randomBytes } from 'crypto';

export function generateBearerToken(length = 32): string {
    return randomBytes(length).toString('hex');
}