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
exports.AuthController = void 0;
class AuthController {
    constructor(authService, compareFieldsValidation) {
        this.authService = authService;
        this.compareFieldsValidation = compareFieldsValidation;
        this.authService = authService;
        this.compareFieldsValidation = compareFieldsValidation;
    }
    signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                this.compareFieldsValidation.validate(data);
                yield this.authService.signUp(data);
                res.status(201).json({ message: 'Usuário criado com sucesso!' });
            }
            catch (error) {
                console.log('Erro no signup: ', error);
                next(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                this.authService.login(data);
            }
            catch (error) {
                console.log('Erro no login: ', error);
                next(error);
            }
        });
    }
}
exports.AuthController = AuthController;
