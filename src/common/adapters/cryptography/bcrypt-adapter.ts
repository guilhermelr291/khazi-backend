import bcrypt from 'bcrypt';
import { Hasher } from '../../../modules/auth/protocols/hasher';
import { HashComparer } from '../../../modules/auth/protocols/hash-comparer';

export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {
    this.salt = salt;
  }
  async hash(value: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.salt);
    const hashedValue = await bcrypt.hash(value, salt);
    return hashedValue;
  }

  async compare(value: string, valueToCompare: string) {
    return await bcrypt.compare(value, valueToCompare);
  }
}
