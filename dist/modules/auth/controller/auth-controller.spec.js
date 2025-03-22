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
const auth_controller_1 = require("./auth-controller");
const mockAuthService = {
    signUp: vitest_1.vi.fn(),
};
const mockCompareFieldsValidation = {
    validate: vitest_1.vi.fn(),
};
(0, vitest_1.describe)('AuthController', () => {
    let sut;
    let mockRequest;
    let mockResponse;
    let mockNext;
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        sut = new auth_controller_1.AuthController(mockAuthService, mockCompareFieldsValidation);
        mockRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                confirmPassword: 'any_password',
            },
        };
        mockResponse = {
            status: vitest_1.vi.fn().mockReturnThis(),
            json: vitest_1.vi.fn(),
        };
        mockNext = vitest_1.vi.fn();
    });
    (0, vitest_1.describe)('signUp', () => {
        (0, vitest_1.test)('Should call CompareFieldsValidation with correct data', () => __awaiter(void 0, void 0, void 0, function* () {
            const validateSpy = vitest_1.vi.spyOn(mockCompareFieldsValidation, 'validate');
            yield sut.signUp(mockRequest, mockResponse, mockNext);
            (0, vitest_1.expect)(validateSpy).toHaveBeenCalledWith(mockRequest.body);
        }));
        (0, vitest_1.test)('Should call AuthService with correct data', () => __awaiter(void 0, void 0, void 0, function* () {
            const signUpSpy = vitest_1.vi.spyOn(mockAuthService, 'signUp');
            yield sut.signUp(mockRequest, mockResponse, mockNext);
            (0, vitest_1.expect)(signUpSpy).toHaveBeenCalledWith(mockRequest.body);
        }));
        (0, vitest_1.test)('Should return 201 on success', () => __awaiter(void 0, void 0, void 0, function* () {
            yield sut.signUp(mockRequest, mockResponse, mockNext);
            (0, vitest_1.expect)(mockResponse.status).toHaveBeenCalledWith(201);
        }));
        (0, vitest_1.test)('Should call next when AuthService throws', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error();
            vitest_1.vi.spyOn(mockAuthService, 'signUp').mockImplementationOnce(() => {
                throw error;
            });
            yield sut.signUp(mockRequest, mockResponse, mockNext);
            (0, vitest_1.expect)(mockNext).toHaveBeenCalledWith(error);
        }));
        (0, vitest_1.test)('Should call next when CompareFieldsValidation throws', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error();
            vitest_1.vi.spyOn(mockCompareFieldsValidation, 'validate').mockImplementationOnce(() => {
                throw error;
            });
            yield sut.signUp(mockRequest, mockResponse, mockNext);
            (0, vitest_1.expect)(mockNext).toHaveBeenCalledWith(error);
        }));
    });
});
