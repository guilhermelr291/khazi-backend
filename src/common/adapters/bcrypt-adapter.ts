import bcrypt from 'bcrypt';

export class BcryptAdapter {
  async hash(value: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    const hashedValue = await bcrypt.hash(value, salt);
    return hashedValue;
  }
}
