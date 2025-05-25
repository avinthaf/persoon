import fs from 'fs/promises';
import path from 'path';
import { FolderStructure } from '../interfaces/User';

export async function createFolderRecursive(structure: FolderStructure, parentPath: string) {
    const currentPath = path.join(parentPath, structure.name);
    await fs.mkdir(currentPath, { recursive: true });

    if (structure.files) {
        for (const file of structure.files) {
            await fs.writeFile(path.join(currentPath, file.name), file.content);
        }
    }

    if (structure.children) {
        for (const child of structure.children) {
            await createFolderRecursive(child, currentPath);
        }
    }
}