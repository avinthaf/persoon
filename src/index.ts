#!/usr/bin/env node
import path from 'path';
import { init } from './commands/init';
import { create } from './commands/create';
import { login } from './commands/login';


async function main() {
    const command = process.argv[2];
    const basePath = path.join(process.cwd(), 'persoon');

    try {
        if (command === 'create') {
            await create(basePath);
        } else if (command === 'init') {
            await init(basePath);
        } else if (command === 'login') {
            await login(basePath);
        } else {
            console.error(`Command '${command}' does not exist`)
        }
    } catch (err) {
        console.error('❌ Error:', err instanceof Error ? err.message : String(err));
        process.exit(1);
    }
}

main();