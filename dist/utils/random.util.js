"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReferralCode = generateReferralCode;
function generateReferralCode(base) {
    const cleanBase = base.replace(/\s+/g, ""); // remove all spaces
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${cleanBase}-${randomPart}`;
}
