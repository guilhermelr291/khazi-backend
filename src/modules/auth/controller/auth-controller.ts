import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../service/auth-service';
import { CompareFieldsValidation } from '../validations/sign-up/compare-fields-validation';

export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly compareFieldsValidation: CompareFieldsValidation
  ) {
    this.authService = authService;
    this.compareFieldsValidation = compareFieldsValidation;
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;

      this.compareFieldsValidation.validate(data);

      await this.authService.signUp(data);

      res.status(201).json({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
      console.log('Erro no signup: ', error);
      next(error);
    }
  }
}
