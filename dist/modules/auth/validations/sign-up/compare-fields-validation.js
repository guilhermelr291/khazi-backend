"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareFieldsValidation = void 0;
const http_errors_1 = require("../../../../common/errors/http-errors");
class CompareFieldsValidation {
    constructor(field, fieldToCompare) {
        this.field = field;
        this.fieldToCompare = fieldToCompare;
        this.field = field;
        this.fieldToCompare = fieldToCompare;
    }
    validate(data) {
        if (data[this.field] !== data[this.fieldToCompare])
            throw new http_errors_1.BadRequestError(`Field ${this.fieldToCompare} does not match ${this.field}`);
    }
}
exports.CompareFieldsValidation = CompareFieldsValidation;
