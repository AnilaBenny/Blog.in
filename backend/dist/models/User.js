"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: null,
    password: '',
    confirmPassword: '',
};
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
    }, lastName: {
        type: String,
    },
    password: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    dob: {
        type: String,
    },
    phone: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.User = User;
