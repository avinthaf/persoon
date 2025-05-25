import fs from 'fs/promises';
import path from 'path';
import { createFolderRecursive } from '../utils/fileSystem';
import { FolderStructure } from '../interfaces/User';

const DEFAULT_SCHEMA = `interface User {
    email?: string;
    firstName: string;
    lastName: string;
    token?: string;
  }
  
  export default User;`;

export async function initProject(basePath: string) {
    const schemaPath = path.join(basePath, 'schema', 'user.ts');

    try {
        await fs.access(schemaPath);
        console.log('✅ Persoon project already exists');
        return false;
    } catch {
        const structure: FolderStructure = {
            name: 'persoon',
            children: [
                { name: 'users' },
                {
                    name: 'schema',
                    files: [{
                        name: 'user.ts',
                        content: DEFAULT_SCHEMA
                    }]
                }
            ]
        };

        await createFolderRecursive(structure, process.cwd());
        console.log('🎉 Created new Persoon project!');
        return true;
    }
}