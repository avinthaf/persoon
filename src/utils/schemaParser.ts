export function parseSchemaInterface(content: string): {
    interfaceName: string;
    fields: string[];
} {
    const interfaceMatch = content.match(/interface\s+(\w+)\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/s);
    if (!interfaceMatch) throw new Error('No interface found in schema file');

    const interfaceName = interfaceMatch[1];
    const fields: string[] = [];
    let fieldWithChildren: string | null = null;

    interfaceMatch[2].split('\n').forEach((line) => {
        if (line.includes('{')) {
            fieldWithChildren = line.trim().match(/^(\w+\??):/)?.[1] ?? null;
            return;
        }

        if (line.includes('}')) {
            fieldWithChildren = null;
            return;
        }

        const fieldMatch = line.trim().match(/^(\w+\??):/);
        if (fieldMatch) {
            const fieldName = fieldWithChildren ? `${fieldWithChildren}.${fieldMatch[1]}` : fieldMatch[1];
            fields.push(fieldName);
        }
    });

    return { interfaceName, fields };
}