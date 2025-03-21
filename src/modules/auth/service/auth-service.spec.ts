import { beforeEach, describe, expect, test, vi } from 'vitest';
import { UserRepository } from '../../user/repository/user-repository';
import { BcryptAdapter } from '../../../common/adapters/bcrypt-adapter';

import { AuthService, SignUpParams } from './auth-service';
import { User } from '@prisma/client';

const mockUserRepository = {
  getByEmail: vi.fn(),
  create: vi.fn(),
} as unknown as UserRepository;

const mockHasher = {
  hash: vi.fn().mockResolvedValue('hashed_password'),
} as unknown as BcryptAdapter;

const mockSignUpParams = (): SignUpParams => ({
  email: 'any_email',
  password: 'any_password',
  confirmPassword: 'any_password',
  name: 'any_name',
});

const mockUserModel = (): User => ({
  id: 1,
  email: 'any_email',
  password: 'any_password',
  name: 'any_name',
});

describe('AuthService', () => {
  let sut: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();

    sut = new AuthService(mockUserRepository, mockHasher);
  });

  describe('signUp', () => {
    test('ensure AuthService calls UserRepository.getByEmail with correct value', async () => {
      const getByEmailSpy = vi.spyOn(mockUserRepository, 'getByEmail');

      await sut.signUp(mockSignUpParams());

      expect(getByEmailSpy).toHaveBeenCalledWith(mockSignUpParams().email);
    });
    test('ensure AuthService throws if UserRepository.getByEmail returns a user', async () => {
      vi.spyOn(mockUserRepository, 'getByEmail').mockResolvedValueOnce(
        mockUserModel()
      );

      expect(sut.signUp(mockSignUpParams())).rejects.toThrow();
    });
    test('ensure AuthService calls UserRepository.create with correct values', async () => {
      const createSpy = vi.spyOn(mockUserRepository, 'create');

      let signUpParams = mockSignUpParams();

      await sut.signUp(signUpParams);

      signUpParams.password = 'hashed_password';

      expect(createSpy).toHaveBeenCalledWith(signUpParams);
    });
    test('ensure AuthService calls Hasher with correct value', async () => {
      const hashSpy = vi.spyOn(mockHasher, 'hash');

      const signUpParams = mockSignUpParams();

      await sut.signUp(signUpParams);

      expect(hashSpy).toHaveBeenCalledWith(signUpParams.password);
    });
    test('ensure AuthService throws if UserRepository.getByEmail throws', async () => {
      vi.spyOn(mockUserRepository, 'getByEmail').mockImplementationOnce(() => {
        throw new Error();
      });

      expect(sut.signUp(mockSignUpParams())).rejects.toThrow();
    });
    test('ensure AuthService throws if Hasher throws', async () => {
      vi.spyOn(mockHasher, 'hash').mockImplementationOnce(() => {
        throw new Error();
      });

      expect(sut.signUp(mockSignUpParams())).rejects.toThrow();
    });

    test('ensure AuthService throws if UserRepository.create throws', async () => {
      vi.spyOn(mockUserRepository, 'create').mockImplementationOnce(() => {
        throw new Error();
      });

      expect(sut.signUp(mockSignUpParams())).rejects.toThrow();
    });
  });
});
