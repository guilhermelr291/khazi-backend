"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.SignUpSchema = zod_1.default.object({
    name: zod_1.default.string().min(2, 'Name must have, at least, 2 caracteres'),
    email: zod_1.default.string().email('Email is required'),
    password: zod_1.default.string().min(6, 'Password must have, at least, 6 caracteres'),
    confirmPassword: zod_1.default
        .string()
        .min(6, 'ConfirmPassword must have, at least, 6 caracteres'),
});
