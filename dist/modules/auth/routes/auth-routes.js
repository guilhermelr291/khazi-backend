"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signup_schemas_1 = require("../validations/sign-up/signup-schemas");
const validation_middleware_1 = require("../../../common/middlewares/validation-middleware");
const auth_controller_factory_1 = require("../../../common/factories/auth/auth-controller-factory");
const login_schemas_1 = require("../validations/login/login-schemas");
const authController = (0, auth_controller_factory_1.makeAuthController)();
exports.default = (router) => {
    router.post('/signup', (0, validation_middleware_1.validate)(signup_schemas_1.SignUpSchema), (req, res, next) => authController.signUp(req, res, next));
    router.post('/login', (0, validation_middleware_1.validate)(login_schemas_1.LoginSchema), (req, res, next) => authController.login(req, res, next));
};
