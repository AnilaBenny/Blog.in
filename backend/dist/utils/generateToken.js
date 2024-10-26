"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = ({ userId }) => {
    const accessToken = jsonwebtoken_1.default.sign({ userId }, "anila@123", {
        expiresIn: '30m',
    });
    const refreshToken = jsonwebtoken_1.default.sign({ userId }, "anila@123", {
        expiresIn: '30d',
    });
    return { accessToken, refreshToken };
};
exports.default = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, "anila@123");
};
exports.verifyToken = verifyToken;
