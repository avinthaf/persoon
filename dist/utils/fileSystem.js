"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFolderRecursive = createFolderRecursive;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
async function createFolderRecursive(structure, parentPath) {
    const currentPath = path_1.default.join(parentPath, structure.name);
    await promises_1.default.mkdir(currentPath, { recursive: true });
    if (structure.files) {
        for (const file of structure.files) {
            await promises_1.default.writeFile(path_1.default.join(currentPath, file.name), file.content);
        }
    }
    if (structure.children) {
        for (const child of structure.children) {
            await createFolderRecursive(child, currentPath);
        }
    }
}
