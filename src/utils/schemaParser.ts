export function parseUserInterface(content: string): string[] {
    const interfaceMatch = content.match(/interface User \{[^}]*\}/s);
    if (!interfaceMatch) return [];

    const fields: string[] = [];
    const lines = interfaceMatch[0].split('\n');

    for (const line of lines) {
        const fieldMatch = line.trim().match(/^(\w+)\??:/);
        if (fieldMatch && fieldMatch[1] !== 'token') {  // Explicitly exclude token
            fields.push(fieldMatch[1]);
        }
    }

    return fields;
}