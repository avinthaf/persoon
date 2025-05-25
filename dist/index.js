#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const init_1 = require("./commands/init");
const create_1 = require("./commands/create");
const login_1 = require("./commands/login");
async function main() {
    const command = process.argv[2];
    const basePath = path_1.default.join(process.cwd(), 'persoon');
    try {
        if (command === 'create') {
            await (0, create_1.create)(basePath);
        }
        else if (command === 'init') {
            await (0, init_1.init)(basePath);
        }
        else if (command === 'login') {
            await (0, login_1.login)(basePath);
        }
        else {
            console.error(`Command '${command}' does not exist`);
        }
    }
    catch (err) {
        console.error('❌ Error:', err instanceof Error ? err.message : String(err));
        process.exit(1);
    }
}
main();
