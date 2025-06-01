import fs from 'fs/promises';
import path from 'path';

interface SearchOptions {
    recursive?: boolean;      // Search subdirectories
    includeFilename?: boolean; // Include source filename in results
    maxDepth?: number;        // Maximum recursion depth
}

/**
 * Finds all JSON objects containing a specific user_id in src/persoon/data/[subfolder]
 * @param userId The user_id to find
 * @param subfolder Subfolder within src/persoon/data to search (optional)
 * @param options Search options
 * @returns Array of matching objects
 */
export async function getPersoonData(
    userId: string,
    subfolder: string = '',  // Default to empty string for root data directory
    options: SearchOptions = {}
): Promise<Array<Record<string, any>>> {
    const {
        recursive = false,
        includeFilename = true,
        maxDepth = 5
    } = options;

    // Construct the full path to search
    const baseDir = path.join(process.cwd(), 'src', 'persoon', 'data', subfolder);

    async function searchDir(currentPath: string, depth: number): Promise<Array<Record<string, any>>> {
        if (depth > maxDepth) return [];

        try {
            const entries = await fs.readdir(currentPath, { withFileTypes: true });
            const results: Array<Record<string, any>> = [];

            for (const entry of entries) {
                const fullPath = path.join(currentPath, entry.name);

                if (entry.isDirectory() && recursive) {
                    const subResults = await searchDir(fullPath, depth + 1);
                    results.push(...subResults);
                } else if (entry.isFile() && entry.name.endsWith('.json')) {
                    try {
                        const content = await fs.readFile(fullPath, 'utf-8');
                        const data = JSON.parse(content);

                        if (data.user_id === userId) {
                            const result = { ...data };
                            if (includeFilename) {
                                result._sourceFile = fullPath;
                            }
                            results.push(result);
                        }
                    } catch (error) {
                        console.error(`Error processing ${fullPath}:`, error);
                    }
                }
            }

            return results;
        } catch (error) {
            console.error(`Error reading directory ${currentPath}:`, error);
            return [];
        }
    }

    return searchDir(baseDir, 0);
}