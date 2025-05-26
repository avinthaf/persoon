import fs from 'fs/promises';
import path from 'path';
import { createPromptInterface, askQuestion } from '../utils/prompt';
import { UserData } from '../interfaces/User';
import { generateJWTToken, verifyJWTToken } from '../utils/tokenGenerator';

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

        // Verify existing token
        try {
            verifyJWTToken(user.token);
            console.log('✅ Existing token is valid');
        } catch (err) {
            console.log('⚠️  Existing token expired or invalid');
        }

        // Generate new token while preserving all user data
        const refreshedUser = {
            ...user,
            token: generateJWTToken(user)
        };

        // Save updated user with new token
        await fs.writeFile(filePath, JSON.stringify(refreshedUser, null, 2));
        
        console.log('\n🔑 Refreshed token:');
        console.log(refreshedUser.token);
        console.log('\n✅ Token refreshed and saved to user file');

    } catch (err) {
        if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
            throw new Error('User not found');
        }
        throw err;
    } finally {
        rl.close();
    }
}