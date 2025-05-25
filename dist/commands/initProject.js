"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initProject = initProject;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const fileSystem_1 = require("../utils/fileSystem");
const DEFAULT_SCHEMA = `interface User {
    email?: string;
    firstName: string;
    lastName: string;
    token?: string;
  }
  
  export default User;`;
async function initProject(basePath) {
    const schemaPath = path_1.default.join(basePath, 'schema', 'user.ts');
    try {
        await promises_1.default.access(schemaPath);
        console.log('✅ Persoon project already exists');
        return false;
    }
    catch {
        const structure = {
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
        await (0, fileSystem_1.createFolderRecursive)(structure, process.cwd());
        console.log('🎉 Created new Persoon project!');
        return true;
    }
}
