import fs from 'fs/promises';
import path from 'path';
import { createPromptInterface, askQuestion } from '../utils/prompt';
import { parseUserInterface } from '../utils/schemaParser';
import { UserData } from '../interfaces/User';
import { generateBearerToken } from '../utils/tokenGenerator';

export async function createUser(basePath: string) {
    const rl = createPromptInterface();

    try {
        const schemaPath = path.join(basePath, 'schema', 'user.ts');
        await fs.access(schemaPath);

        const schemaContent = await fs.readFile(schemaPath, 'utf-8');
        const userFields = parseUserInterface(schemaContent);
        const requiredFields = ['firstName', 'lastName'];
        
        // Filter out token from fields we prompt for
        const fieldsToPrompt = userFields.filter(field => field !== 'token');
        const allFields = [...new Set([...requiredFields, ...fieldsToPrompt])];

        const user: UserData = {};

        // Collect user data (excluding token)
        for (const field of allFields) {
            const isRequired = requiredFields.includes(field) || !userFields.includes(field + '?');
            user[field] = await askQuestion(rl, `${field}${isRequired ? ' (required)' : ''}: `, isRequired);
        }

        // Automatically generate and add bearer token
        user.token = `Bearer ${generateBearerToken()}`;

        const fileName = `${user.firstName!.toLowerCase()}_${user.lastName!.toLowerCase()}.json`;
        const filePath = path.join(basePath, 'users', fileName);

        await fs.writeFile(filePath, JSON.stringify(user, null, 2));
        console.log(`✅ Created user: ${fileName}`);
        console.log(`🔑 Auto-generated token: ${user.token}`);
    } finally {
        rl.close();
    }
}