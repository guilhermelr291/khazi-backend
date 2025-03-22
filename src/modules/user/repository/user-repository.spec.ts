import { beforeEach, describe, expect, test, vi } from 'vitest';

import { UserRepository } from './user-repository';
import prisma from '../../../prisma/db';

vi.mock('../../../prisma/db', () => ({
  default: {
    user: { findUnique: vi.fn(), create: vi.fn() },
  },
}));

describe('UserRepository', () => {
  let sut: UserRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    sut = new UserRepository();
  });

  describe('getByEmail', () => {
    test('should return user if it is found', async () => {
      const mockUser = {
        id: 1,
        email: 'any_email',
        name: 'any_name',
        password: 'any_password',
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockUser);

      const result = await sut.getByEmail('any_email');

      expect(result).toStrictEqual(mockUser);
    });
  });
});
