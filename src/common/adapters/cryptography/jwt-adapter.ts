import jwt from 'jsonwebtoken';
import { Encrypter } from '../../../modules/auth/protocols/encrypter';

export class JwtAdapter implements Encrypter {
  private readonly SECRET: string;
  constructor() {
    this.SECRET = process.env.JWT_SECRET!;
  }

  encrypt(data: {}): string {
    return jwt.sign(data, this.SECRET);
  }
}
