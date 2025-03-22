"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const compare_fields_validation_1 = require("./compare-fields-validation");
(0, vitest_1.describe)('CompareFieldsValidation', () => {
    (0, vitest_1.test)('Should throw if field does not match fieldToCompare', () => {
        const field = 'any_field';
        const fieldToCompare = 'other_field';
        const sut = new compare_fields_validation_1.CompareFieldsValidation(field, fieldToCompare);
        (0, vitest_1.expect)(() => sut.validate({ any_field: 'value', other_field: 'different_value' })).toThrow();
    });
    (0, vitest_1.test)('Should return void if field matches fieldToCompare', () => {
        const field = 'any_field';
        const fieldToCompare = 'other_field';
        const sut = new compare_fields_validation_1.CompareFieldsValidation(field, fieldToCompare);
        const result = sut.validate({ any_field: 'value', other_field: 'value' });
        (0, vitest_1.expect)(result).toBeFalsy();
    });
});
