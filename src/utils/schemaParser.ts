import ts from 'typescript';

export function parseSchemaInterface(content: string): {
    interfaceName: string;
    fields: string[];
    nestedInterfaces?: { name: string; fields: string[] }[];
} {
    const sourceFile = ts.createSourceFile(
        'temp.ts',
        content,
        ts.ScriptTarget.Latest,
        true
    );

    let interfaceName = '';
    const fields: string[] = [];
    const nestedInterfaces: { name: string; fields: string[] }[] = [];

    ts.forEachChild(sourceFile, (node) => {
        if (ts.isInterfaceDeclaration(node)) {
            interfaceName = node.name.text;

            // Process interface members
            node.members.forEach((member) => {
                if (ts.isPropertySignature(member)) {
                    const propertyName = member.name.getText(sourceFile);
                    const isOptional = member.questionToken !== undefined;
                    const fieldName = isOptional ? `${propertyName}?` : propertyName;

                    // Handle nested object types
                    if (member.type && ts.isTypeLiteralNode(member.type)) {
                        const nestedFields: string[] = [];

                        member.type.members.forEach((nestedMember) => {
                            if (ts.isPropertySignature(nestedMember)) {
                                const nestedPropertyName = nestedMember.name.getText(sourceFile);
                                const isNestedOptional = nestedMember.questionToken !== undefined;
                                const nestedFieldName = isNestedOptional ? `${nestedPropertyName}?` : nestedPropertyName;

                                // Handle doubly-nested types
                                if (nestedMember.type && ts.isTypeLiteralNode(nestedMember.type)) {
                                    nestedMember.type.members.forEach((doubleNestedMember) => {
                                        if (ts.isPropertySignature(doubleNestedMember)) {
                                            const doubleNestedName = doubleNestedMember.name.getText(sourceFile);
                                            const isDoubleOptional = doubleNestedMember.questionToken !== undefined;
                                            fields.push(`${propertyName}.${nestedPropertyName}.${doubleNestedName}${isDoubleOptional ? '?' : ''}`);
                                        }
                                    });
                                } else {
                                    fields.push(`${propertyName}.${nestedFieldName}`);
                                }

                                nestedFields.push(nestedFieldName);
                            }
                        });

                        nestedInterfaces.push({
                            name: propertyName,
                            fields: nestedFields
                        });
                    } else {
                        fields.push(fieldName);
                    }
                }
            });
        }
    });

    if (!interfaceName) {
        throw new Error('No interface found in schema file');
    }

    return {
        interfaceName,
        fields,
        nestedInterfaces: nestedInterfaces.length > 0 ? nestedInterfaces : undefined
    };
}