import readline from 'readline';

export function createPromptInterface() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
}

export async function askQuestion(
    rl: readline.Interface,
    question: string,
    required: boolean
): Promise<string> {
    return new Promise((resolve) => {
        const ask = () => {
            rl.question(question, (answer) => {
                if (required && !answer.trim()) {
                    console.log('This field is required!');
                    ask();
                } else {
                    resolve(answer.trim());
                }
            });
        };
        ask();
    });
}