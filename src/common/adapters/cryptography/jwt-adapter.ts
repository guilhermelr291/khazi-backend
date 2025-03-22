import jwt from 'jsonwebtoken';

export class JwtAdapter {
  private readonly SECRET: string;
  constructor() {
    this.SECRET = process.env.JWT_SECRET!;
  }

  async encode(data: {}): Promise<string> {
    return jwt.sign(data, this.SECRET);
  }
}
