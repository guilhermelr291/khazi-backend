"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
function validate(schema) {
    return (req, res, next) => {
        const validationResult = schema.safeParse(req.body);
        if (!validationResult.success) {
            const errors = validationResult.error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
                code: err.code,
            }));
            res.status(422).json({
                message: 'Validation failed',
                errors,
            });
            return;
        }
        next();
    };
}
