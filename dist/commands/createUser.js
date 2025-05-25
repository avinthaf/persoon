"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const prompt_1 = require("../utils/prompt");
const schemaParser_1 = require("../utils/schemaParser");
const tokenGenerator_1 = require("../utils/tokenGenerator");
async function createUser(basePath) {
    const rl = (0, prompt_1.createPromptInterface)();
    try {
        const schemaPath = path_1.default.join(basePath, 'schema', 'user.ts');
        await promises_1.default.access(schemaPath);
        const schemaContent = await promises_1.default.readFile(schemaPath, 'utf-8');
        const userFields = (0, schemaParser_1.parseUserInterface)(schemaContent);
        const requiredFields = ['firstName', 'lastName'];
        // Filter out token from fields we prompt for
        const fieldsToPrompt = userFields.filter(field => field !== 'token');
        const allFields = [...new Set([...requiredFields, ...fieldsToPrompt])];
        const user = {};
        // Collect user data (excluding token)
        for (const field of allFields) {
            const isRequired = requiredFields.includes(field) || !userFields.includes(field + '?');
            user[field] = await (0, prompt_1.askQuestion)(rl, `${field}${isRequired ? ' (required)' : ''}: `, isRequired);
        }
        // Automatically generate and add bearer token
        user.token = `Bearer ${(0, tokenGenerator_1.generateBearerToken)()}`;
        const fileName = `${user.firstName.toLowerCase()}_${user.lastName.toLowerCase()}.json`;
        const filePath = path_1.default.join(basePath, 'users', fileName);
        await promises_1.default.writeFile(filePath, JSON.stringify(user, null, 2));
        console.log(`✅ Created user: ${fileName}`);
        console.log(`🔑 Auto-generated token: ${user.token}`);
    }
    finally {
        rl.close();
    }
}
