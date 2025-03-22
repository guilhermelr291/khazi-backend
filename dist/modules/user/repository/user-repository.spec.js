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
const user_repository_1 = require("./user-repository");
const db_1 = __importDefault(require("../../../prisma/db"));
vitest_1.vi.mock('../../../prisma/db', () => ({
    default: {
        user: { findUnique: vitest_1.vi.fn(), create: vitest_1.vi.fn() },
    },
}));
const mockUser = () => ({
    id: 1,
    email: 'any_email',
    name: 'any_name',
    password: 'any_password',
});
const mockSighUpParams = () => ({
    email: 'any_email',
    name: 'any_name',
    password: 'any_password',
    confirmPassword: 'any_password',
});
(0, vitest_1.describe)('UserRepository', () => {
    let sut;
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        sut = new user_repository_1.UserRepository();
    });
    (0, vitest_1.describe)('getByEmail', () => {
        (0, vitest_1.test)('Should call prisma findUnique with correct value', () => __awaiter(void 0, void 0, void 0, function* () {
            yield sut.getByEmail('any_email');
            (0, vitest_1.expect)(db_1.default.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'any_email' },
            });
        }));
        (0, vitest_1.test)('Should return user if it is found', () => __awaiter(void 0, void 0, void 0, function* () {
            vitest_1.vi.mocked(db_1.default.user.findUnique).mockResolvedValueOnce(mockUser());
            const result = yield sut.getByEmail('any_email');
            (0, vitest_1.expect)(result).toStrictEqual(mockUser());
        }));
        (0, vitest_1.test)('Should return null if user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            vitest_1.vi.mocked(db_1.default.user.findUnique).mockResolvedValueOnce(null);
            const result = yield sut.getByEmail('any_email');
            (0, vitest_1.expect)(result).toBeNull();
        }));
        (0, vitest_1.test)('Should throw if prisma throws', () => __awaiter(void 0, void 0, void 0, function* () {
            vitest_1.vi.mocked(db_1.default.user.findUnique).mockImplementationOnce(() => {
                throw new Error();
            });
            (0, vitest_1.expect)(sut.getByEmail('any_email')).rejects.toThrow();
        }));
    });
    (0, vitest_1.describe)('create', () => {
        (0, vitest_1.test)('Should call prisma created method with correct data', () => __awaiter(void 0, void 0, void 0, function* () {
            yield sut.create(mockSighUpParams());
            (0, vitest_1.expect)(db_1.default.user.create).toHaveBeenCalledWith({
                data: {
                    email: 'any_email',
                    name: 'any_name',
                    password: 'any_password',
                },
            });
        }));
        (0, vitest_1.test)('Should return user returned by prisma created method', () => __awaiter(void 0, void 0, void 0, function* () {
            vitest_1.vi.mocked(db_1.default.user.create).mockResolvedValueOnce(mockUser());
            const result = yield sut.create(mockSighUpParams());
            (0, vitest_1.expect)(result).toStrictEqual(mockUser());
        }));
        (0, vitest_1.test)('Should throw if prisma throws', () => __awaiter(void 0, void 0, void 0, function* () {
            vitest_1.vi.mocked(db_1.default.user.create).mockImplementationOnce(() => {
                throw new Error();
            });
            (0, vitest_1.expect)(sut.create(mockSighUpParams())).rejects.toThrow();
        }));
    });
});
