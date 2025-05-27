export function parseSchemaInterface(content: string): {
    interfaceName: string;
    fields: string[];
} {
    const interfaceMatch = content.match(/interface\s+(\w+)\s*\{([^}]*)\}/);
    if (!interfaceMatch) throw new Error('No interface found in schema file');

    const interfaceName = interfaceMatch[1];
    const fields: string[] = [];
    
    interfaceMatch[2].split('\n').forEach(line => {
        const fieldMatch = line.trim().match(/^(\w+\??):/);
        if (fieldMatch) fields.push(fieldMatch[1]);
    });

    return { interfaceName, fields };
}