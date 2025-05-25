#!/usr/bin/env node
import path from 'path';
import { initProject } from './commands/initProject';
import { createUser } from './commands/createUser';

async function main() {
    const command = process.argv[2];
    const basePath = path.join(process.cwd(), 'persoon');

    try {
        if (command === 'create') {
            await createUser(basePath);
        } else {
            await initProject(basePath);
        }
    } catch (err) {
        console.error('❌ Error:', err instanceof Error ? err.message : String(err));
        process.exit(1);
    }
}

main();