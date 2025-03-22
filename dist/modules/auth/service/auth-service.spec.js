"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const auth_service_1 = require("./auth-service");
const mockUserRepository = {
    getByEmail: vitest_1.vi.fn(),
    create: vitest_1.vi.fn(),
};
const mockBcryptAdapter = {
    hash: vitest_1.vi.fn().mockResolvedValue('hashed_password'),
};
const mockJwtAdapter = {
    encode: vitest_1.vi.fn().mockResolvedValueOnce('encoded_value'),
};
const mockSignUpParams = () => ({
    email: 'any_email',
    password: 'any_password',
    confirmPassword: 'any_password',
    name: 'any_name',
});
const mockUserModel = () => ({
    id: 1,
    email: 'any_email',
    password: 'any_password',
    name: 'any_name',
});
(0, vitest_1.describe)('AuthService', () => {
    let sut;
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        sut = new auth_service_1.AuthService(mockUserRepository, mockBcryptAdapter, mockJwtAdapter);
    });
    (0, vitest_1.describe)('signUp', () => {
        (0, vitest_1.test)('should call UserRepository.getByEmail with correct value', () => __awaiter(void 0, void 0, void 0, function* () {
            const getByEmailSpy = vitest_1.vi.spyOn(mockUserRepository, 'getByEmail');
            yield sut.signUp(mockSignUpParams());
            (0, vitest_1.expect)(getByEmailSpy).toHaveBeenCalledWith(mockSignUpParams().email);
        }));
        (0, vitest_1.test)('ensure AuthService throws if UserRepository.getByEmail returns a user', () => __awaiter(void 0, void 0, void 0, function* () {
            vitest_1.vi.spyOn(mockUserRepository, 'getByEmail').mockResolvedValueOnce(mockUserModel());
            (0, vitest_1.expect)(sut.signUp(mockSignUpParams())).rejects.toThrow();
        }));
        (0, vitest_1.test)('should call UserRepository.create with correct values', () => __awaiter(void 0, void 0, void 0, function* () {
            const createSpy = vitest_1.vi.spyOn(mockUserRepository, 'create');
            let signUpParams = mockSignUpParams();
            yield sut.signUp(signUpParams);
            signUpParams.password = 'hashed_password';
            (0, vitest_1.expect)(createSpy).toHaveBeenCalledWith(signUpParams);
        }));
        (0, vitest_1.test)('should call BcryptAdapter with correct value', () => __awaiter(void 0, void 0, void 0, function* () {
            const hashSpy = vitest_1.vi.spyOn(mockBcryptAdapter, 'hash');
            const signUpParams = mockSignUpParams();
            yield sut.signUp(signUpParams);
            (0, vitest_1.expect)(hashSpy).toHaveBeenCalledWith(signUpParams.password);
        }));
        (0, vitest_1.test)('should throw if UserRepository.getByEmail throws', () => __awaiter(void 0, void 0, void 0, function* () {
            vitest_1.vi.spyOn(mockUserRepository, 'getByEmail').mockImplementationOnce(() => {
                throw new Error();
            });
            (0, vitest_1.expect)(sut.signUp(mockSignUpParams())).rejects.toThrow();
        }));
        (0, vitest_1.test)('should throw if BcryptAdapter throws', () => __awaiter(void 0, void 0, void 0, function* () {
            vitest_1.vi.spyOn(mockBcryptAdapter, 'hash').mockImplementationOnce(() => {
                throw new Error();
            });
            (0, vitest_1.expect)(sut.signUp(mockSignUpParams())).rejects.toThrow();
        }));
        (0, vitest_1.test)('should throw if UserRepository.create throws', () => __awaiter(void 0, void 0, void 0, function* () {
            vitest_1.vi.spyOn(mockUserRepository, 'create').mockImplementationOnce(() => {
                throw new Error();
            });
            (0, vitest_1.expect)(sut.signUp(mockSignUpParams())).rejects.toThrow();
        }));
    });
});
