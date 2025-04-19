import { beforeEach, describe, expect, test, vi } from 'vitest';
import { UserRepository } from './user-repository';
import prisma from '../../../../prisma/db';
import { SignUpParams } from '../../auth/service/auth-service';
import { User } from '@prisma/client';

vi.mock('../../../../prisma/db', () => ({
  default: {
    user: { findUnique: vi.fn(), create: vi.fn() },
  },
}));

const mockUser = (): User => ({
  id: 1,
  email: 'any_email',
  name: 'any_name',
  password: 'any_password',
});

const mockSighUpParams = (): SignUpParams => ({
  email: 'any_email',
  name: 'any_name',
  password: 'any_password',
  confirmPassword: 'any_password',
});

describe('UserRepository', () => {
  let sut: UserRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    sut = new UserRepository();
  });

  describe('getByEmail', () => {
    test('Should call prisma findUnique with correct value', async () => {
      await sut.getByEmail('any_email');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'any_email' },
      });
    });

    test('Should return user if it is found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockUser());

      const result = await sut.getByEmail('any_email');

      expect(result).toStrictEqual(mockUser());
    });

    test('Should return null if user does not exist', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
      const result = await sut.getByEmail('any_email');

      expect(result).toBeNull();
    });
    test('Should throw if prisma throws', async () => {
      vi.mocked(prisma.user.findUnique).mockImplementationOnce(() => {
        throw new Error();
      });

      expect(sut.getByEmail('any_email')).rejects.toThrow();
    });
  });

  describe('create', () => {
    test('Should call prisma created method with correct data', async () => {
      await sut.create(mockSighUpParams());

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'any_email',
          name: 'any_name',
          password: 'any_password',
        },
      });
    });

    test('Should return user returned by prisma created method', async () => {
      vi.mocked(prisma.user.create).mockResolvedValueOnce(mockUser());

      const result = await sut.create(mockSighUpParams());

      expect(result).toStrictEqual(mockUser());
    });

    test('Should throw if prisma throws', async () => {
      vi.mocked(prisma.user.create).mockImplementationOnce(() => {
        throw new Error();
      });

      expect(sut.create(mockSighUpParams())).rejects.toThrow();
    });
  });
});
