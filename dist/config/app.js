"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const error_handler_middleware_1 = require("../common/middlewares/error-handler-middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, routes_1.default)(app);
app.use(error_handler_middleware_1.errorHandler);
exports.default = app;
