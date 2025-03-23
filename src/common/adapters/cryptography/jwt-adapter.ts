import jwt from 'jsonwebtoken';

export class JwtAdapter {
  private readonly SECRET: string;
  constructor() {
    this.SECRET = process.env.JWT_SECRET!;
  }

  encode(data: {}): string {
    return jwt.sign(data, this.SECRET);
  }
}
