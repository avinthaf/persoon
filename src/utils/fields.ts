export function expandNestedFields<T extends Record<string, any>>(flatObject: T): Record<string, any> {
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(flatObject)) {
        // Skip if the value is undefined or null
        if (value === undefined || value === null) {
            continue;
        }

        // Split the key by dots to handle nesting
        const keys = key.split('.');
        let currentLevel = result;

        for (let i = 0; i < keys.length; i++) {
            const currentKey = keys[i];
            const isLastKey = i === keys.length - 1;

            // If we're at the last key, set the value
            if (isLastKey) {
                currentLevel[currentKey] = value;
            }
            // Otherwise, ensure the nested structure exists
            else {
                // Create nested object if it doesn't exist
                if (!currentLevel[currentKey]) {
                    currentLevel[currentKey] = {};
                }
                // Move down to the next level
                currentLevel = currentLevel[currentKey];
            }
        }
    }

    return result;
}