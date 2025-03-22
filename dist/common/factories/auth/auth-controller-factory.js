"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAuthController = void 0;
const auth_controller_1 = require("../../../modules/auth/controller/auth-controller");
const auth_service_1 = require("../../../modules/auth/service/auth-service");
const compare_fields_validation_1 = require("../../../modules/auth/validations/sign-up/compare-fields-validation");
const user_repository_1 = require("../../../modules/user/repository/user-repository");
const bcrypt_adapter_1 = require("../../adapters/cryptography/bcrypt-adapter");
const jwt_adapter_1 = require("../../adapters/cryptography/jwt-adapter");
const makeAuthController = () => {
    const userRepository = new user_repository_1.UserRepository();
    const bcryptAdapter = new bcrypt_adapter_1.BcryptAdapter(12);
    const jwtAdapter = new jwt_adapter_1.JwtAdapter();
    const authService = new auth_service_1.AuthService(userRepository, bcryptAdapter, jwtAdapter);
    const compareFieldsValidation = new compare_fields_validation_1.CompareFieldsValidation('password', 'confirmPassword');
    return new auth_controller_1.AuthController(authService, compareFieldsValidation);
};
exports.makeAuthController = makeAuthController;
