#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const initProject_1 = require("./commands/initProject");
const createUser_1 = require("./commands/createUser");
async function main() {
    const command = process.argv[2];
    const basePath = path_1.default.join(process.cwd(), 'persoon');
    try {
        if (command === 'create') {
            await (0, createUser_1.createUser)(basePath);
        }
        else {
            await (0, initProject_1.initProject)(basePath);
        }
    }
    catch (err) {
        console.error('❌ Error:', err instanceof Error ? err.message : String(err));
        process.exit(1);
    }
}
main();
