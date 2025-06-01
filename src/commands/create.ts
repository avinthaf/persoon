import fs from 'fs/promises';
import path from 'path';
import { createPromptInterface, askQuestion } from '../utils/prompt';
import { parseSchemaInterface } from '../utils/schemaParser';
import { UserData } from '../interfaces/User';
import { generateJWTToken } from '../utils/tokenGenerator';
import { v4 as uuidv4 } from 'uuid'; // Add this import

export async function create(basePath: string) {
    const rl = createPromptInterface();

    let schemaName: string = "";

    try {
        // Get schema name from user
        schemaName = await askQuestion(rl, 'Enter schema name (e.g., "user"): ', true);
        const schemaPath = path.join(basePath, 'schema', `${schemaName}.ts`);

        // Check if schema exists
        await fs.access(schemaPath);
        const schemaContent = await fs.readFile(schemaPath, 'utf-8');

        // Special case: preserve existing user creation logic
        if (schemaName === 'user') {
            return await createUserFile(basePath, rl, schemaContent);
        }

        // Generic schema handling
        const { interfaceName, fields } = parseSchemaInterface(schemaContent);
        const data: Record<string, any> = {};

        // Check for 'name' field in schema
        const hasNameField = fields.some(f => f.replace('?', '') === 'name');
        if (!hasNameField) {
            throw new Error(`Schema must include a 'name' field`);
        }

        for (const field of fields) {
            const isRequired = !field.endsWith('?');
            const cleanField = field.replace('?', '');

            data[cleanField] = await askQuestion(
                rl,
                `${cleanField}${isRequired ? ` (required)` : ''}: `,
                isRequired || cleanField === 'name' // Ensure name is always required
            );
        }

        // Generate UUID and add to data
        const id = uuidv4();
        data.id = id;

        const fileName = `${data.name.toLowerCase().replace(/\s+/g, '_')}_${id}.json`;
        const filePath = path.join(basePath, 'data', schemaName, fileName);

        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, JSON.stringify(expandNestedFields(data), null, 2));

        console.log(`✅ Created ${interfaceName} data: ${fileName}`);

    } catch (err) {
        if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
            throw new Error(`Schema "${schemaName}.ts" not found in persoon/schema`);
        }
        throw err;
    } finally {
        rl.close();
    }
}

async function createUserFile(
    basePath: string,
    rl: any,
    schemaContent: string
): Promise<void> {
    const { fields: userFields } = parseSchemaInterface(schemaContent);
    const requiredFields = ['firstName', 'lastName'];
    // const fieldsToPrompt = userFields.filter(field => field !== 'token');
    const allFields = [...new Set([...requiredFields, ...userFields])];

    const user: UserData = {};

    // Only prompt for non-token fields
    for (const field of allFields) {
        const isRequired = requiredFields.includes(field) || !field.endsWith('?');
        user[field] = await askQuestion(rl, `${field}${isRequired ? ' (required)' : ''}: `, isRequired);
    }

    // Auto-generate token without prompting
    user.token = generateJWTToken(user);
    user.id = uuidv4(); // Add unique ID for user

    const fileName = `${user.firstName!.toLowerCase()}_${user.lastName!.toLowerCase()}.json`;
    const filePath = path.join(basePath, 'users', fileName);

    await fs.writeFile(filePath, JSON.stringify(user, null, 2));
    console.log(`✅ Created user: ${fileName}`);
    console.log(`🔑 Auto-generated token: ${user.token}`);
};


function expandNestedFields<T extends Record<string, any>>(flatObject: T): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(flatObject)) {
      // Skip if the value is undefined or null
      if (value === undefined || value === null) {
        continue;
      }
      
      // Split the key by dots to handle nesting
      const keys = key.split('.');
      let currentLevel = result;
      
      for (let i = 0; i < keys.length; i++) {
        const currentKey = keys[i];
        const isLastKey = i === keys.length - 1;
        
        // If we're at the last key, set the value
        if (isLastKey) {
          currentLevel[currentKey] = value;
        } 
        // Otherwise, ensure the nested structure exists
        else {
          // Create nested object if it doesn't exist
          if (!currentLevel[currentKey]) {
            currentLevel[currentKey] = {};
          }
          // Move down to the next level
          currentLevel = currentLevel[currentKey];
        }
      }
    }
    
    return result;
  }

