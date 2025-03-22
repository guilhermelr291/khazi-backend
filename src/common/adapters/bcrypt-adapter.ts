import bcrypt from 'bcrypt';

export class BcryptAdapter {
  constructor(private readonly salt: number) {
    this.salt = salt;
  }
  async hash(value: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.salt);
    const hashedValue = await bcrypt.hash(value, salt);
    return hashedValue;
  }
}
