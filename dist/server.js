"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./config/app"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
app_1.default.listen(5050, () => console.log('Server running at: http://localhost:5050'));
