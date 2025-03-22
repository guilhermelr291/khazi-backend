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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const bcrypt_1 = __importDefault(require("bcrypt"));
const bcrypt_adapter_1 = require("./bcrypt-adapter");
vitest_1.vi.mock('bcrypt', () => ({
    default: {
        hash: vitest_1.vi.fn().mockResolvedValue('hashed_value'),
        genSalt: vitest_1.vi.fn().mockResolvedValue('any_salt'),
    },
}));
(0, vitest_1.describe)('BcryptAdapter', () => {
    let sut;
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        sut = new bcrypt_adapter_1.BcryptAdapter(12);
    });
    (0, vitest_1.describe)('hash', () => {
        (0, vitest_1.test)('Should call bcrypt hash method with correct value', () => __awaiter(void 0, void 0, void 0, function* () {
            yield sut.hash('any_value');
            (0, vitest_1.expect)(bcrypt_1.default.hash).toHaveBeenCalledWith('any_value', 'any_salt');
        }));
        (0, vitest_1.test)('Should throw if bcrypt throws', () => {
            vitest_1.vi.mocked(bcrypt_1.default.hash).mockImplementationOnce(() => {
                throw new Error();
            });
            (0, vitest_1.expect)(sut.hash('any_value')).rejects.toThrow();
        });
        (0, vitest_1.test)('Should return hashed value', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield sut.hash('any_value');
            (0, vitest_1.expect)(result).toBe('hashed_value');
        }));
    });
});
