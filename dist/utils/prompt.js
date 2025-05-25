"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPromptInterface = createPromptInterface;
exports.askQuestion = askQuestion;
const readline_1 = __importDefault(require("readline"));
function createPromptInterface() {
    return readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout
    });
}
async function askQuestion(rl, question, required) {
    return new Promise((resolve) => {
        const ask = () => {
            rl.question(question, (answer) => {
                if (required && !answer.trim()) {
                    console.log('This field is required!');
                    ask();
                }
                else {
                    resolve(answer.trim());
                }
            });
        };
        ask();
    });
}
