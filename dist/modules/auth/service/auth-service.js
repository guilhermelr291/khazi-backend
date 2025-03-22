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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_errors_1 = require("../../../common/errors/http-errors");
class AuthService {
    constructor(userRepository, bcryptAdapter, jwtAdapter) {
        this.userRepository = userRepository;
        this.bcryptAdapter = bcryptAdapter;
        this.jwtAdapter = jwtAdapter;
        this.userRepository = userRepository;
        this.bcryptAdapter = bcryptAdapter;
    }
    signUp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = data;
            const user = yield this.userRepository.getByEmail(email);
            if (user)
                throw new http_errors_1.BadRequestError('Email is already in use');
            const hashedPassword = yield this.bcryptAdapter.hash(password);
            const createdUser = yield this.userRepository.create(Object.assign(Object.assign({}, data), { password: hashedPassword }));
            return createdUser;
        });
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = data;
            const user = yield this.userRepository.getByEmail(email);
            if (!user)
                throw new http_errors_1.UnauthorizedError();
            const passwordMatches = yield this.bcryptAdapter.compare(password, user.password);
            if (!passwordMatches)
                throw new http_errors_1.UnauthorizedError();
            const token = yield this.jwtAdapter.encode({ id: user.id });
            const { password: pass } = user, userToReturn = __rest(user, ["password"]);
            return { token, user: userToReturn };
        });
    }
}
exports.AuthService = AuthService;
