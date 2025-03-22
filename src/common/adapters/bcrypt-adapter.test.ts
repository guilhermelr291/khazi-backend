import { beforeEach, describe, expect, test, vi } from 'vitest';
import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';
vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed_password'),
    genSalt: vi.fn().mockResolvedValue('any_salt'),
  },
}));

describe('BcryptAdapter', () => {
  let sut: BcryptAdapter;
  beforeEach(() => {
    vi.clearAllMocks();

    sut = new BcryptAdapter(12);
  });

  describe('hash', () => {
    test('Should call bcrypt hash method with correct value', async () => {
      await sut.hash('password');

      expect(bcrypt.hash).toHaveBeenCalledWith('password', 'any_salt');
    });

    test('Should throw if bcrypt throws', () => {
      vi.mocked(bcrypt.hash).mockImplementationOnce(() => {
        throw new Error();
      });

      expect(sut.hash('password')).rejects.toThrow();
    });
  });
});
