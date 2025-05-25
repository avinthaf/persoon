import fs from 'fs/promises';
import path from 'path';
import { createPromptInterface, askQuestion } from '../utils/prompt';
import { UserData } from '../interfaces/User';

export async function login(basePath: string) {
    const rl = createPromptInterface();

    try {
        // Get user input
        const firstName = await askQuestion(rl, 'First name: ', true);
        const lastName = await askQuestion(rl, 'Last name: ', true);

        // Generate filename
        const fileName = `${firstName.toLowerCase()}_${lastName.toLowerCase()}.json`;
        const filePath = path.join(basePath, 'users', fileName);

        // Read user file
        const userData = await fs.readFile(filePath, 'utf-8');
        const user: UserData = JSON.parse(userData);

        if (!user.token) {
            throw new Error('No token found for this user');
        }

        console.log(`🔑 Your token: ${user.token}`);
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
            throw new Error('User not found');
        }
        throw err;
    } finally {
        rl.close();
    }
}