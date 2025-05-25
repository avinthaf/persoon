"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBearerToken = generateBearerToken;
const crypto_1 = require("crypto");
function generateBearerToken(length = 32) {
    return (0, crypto_1.randomBytes)(length).toString('hex');
}
