"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUserInterface = parseUserInterface;
function parseUserInterface(content) {
    const interfaceMatch = content.match(/interface User \{[^}]*\}/s);
    if (!interfaceMatch)
        return [];
    const fields = [];
    const lines = interfaceMatch[0].split('\n');
    for (const line of lines) {
        const fieldMatch = line.trim().match(/^(\w+)\??:/);
        if (fieldMatch && fieldMatch[1] !== 'token') { // Explicitly exclude token
            fields.push(fieldMatch[1]);
        }
    }
    return fields;
}
