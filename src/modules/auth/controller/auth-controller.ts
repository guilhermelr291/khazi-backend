import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../service/auth-service';
import { FieldComparer } from '../protocols/fields-comparer';
import { User } from '@prisma/client';

export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fieldComparer: FieldComparer
  ) {
    this.authService = authService;
    this.fieldComparer = fieldComparer;
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;

      this.fieldComparer.compare(data);

      await this.authService.signUp(data);

      res.status(201).json({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
      console.log('Erro no signup: ', error);
      next(error);
    }
  }

  async login(
    req: Request,
    res: Response<{ token: string; user: User }>,
    next: NextFunction
  ) {
    try {
      const userAndToken = await this.authService.login(req.body);

      res.status(200).json(userAndToken);
    } catch (error) {
      console.log('Erro no login: ', error);
      next(error);
    }
  }
}
