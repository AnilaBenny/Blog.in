"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const databaseURI = "mongodb+srv://anilacbenny810:YQKaS1wYCrEscHsV@blogin.pbman.mongodb.net/";
async function connectToDatabase() {
    try {
        if (!databaseURI) {
            console.log('not found');
            throw new Error('MONGODB_URI is not defined in the environment variables.');
        }
        await mongoose_1.default.connect(databaseURI);
        console.log('MongoDB Connected');
    }
    catch (err) {
        console.error('Error connecting to MongoDB: ' + err.message);
        throw err;
    }
}
