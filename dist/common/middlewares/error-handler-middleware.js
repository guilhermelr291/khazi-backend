"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_errors_1 = require("../errors/http-errors");
const errorHandler = (err, req, res, next) => {
    if (err instanceof http_errors_1.HttpError) {
        res.status(err.statusCode).json({
            message: err.message,
        });
        return;
    }
    res.status(500).json({
        message: 'Internal Server Error',
    });
};
exports.errorHandler = errorHandler;
