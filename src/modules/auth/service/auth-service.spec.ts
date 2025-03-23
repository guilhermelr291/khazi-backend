import { beforeEach, describe, expect, test, vi } from 'vitest';
import { UserRepository } from '../../user/repository/user-repository';
import { BcryptAdapter } from '../../../common/adapters/cryptography/bcrypt-adapter';

import { AuthService, LoginParams, SignUpParams } from './auth-service';
import { User } from '@prisma/client';
import { JwtAdapter } from '../../../common/adapters/cryptography/jwt-adapter';
import { UnauthorizedError } from '../../../common/errors/http-errors';

const mockSignUpParams = (): SignUpParams => ({
  email: 'any_email@mail.com',
  password: 'any_password',
  confirmPassword: 'any_password',
  name: 'any_name',
});
const mockLoginParams = (): LoginParams => ({
  email: 'any_email@mail.com',
  password: 'any_password',
});

const mockUserModel = (): User => ({
  id: 1,
  email: 'any_email',
  password: 'any_password',
  name: 'any_name',
});

const mockUserRepository = {
  getByEmail: vi.fn(),
  create: vi.fn(),
} as unknown as UserRepository;

const mockBcryptAdapter = {
  hash: vi.fn().mockResolvedValue('hashed_password'),
  compare: vi.fn().mockResolvedValue(true),
} as unknown as BcryptAdapter;

const mockJwtAdapter = {
  encode: vi.fn().mockResolvedValue('encoded_value'),
} as unknown as JwtAdapter;
describe('AuthService', () => {
  let sut: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();

    sut = new AuthService(
      mockUserRepository,
      mockBcryptAdapter,
      mockJwtAdapter
    );
  });

  describe('signUp', () => {
    test('Should call UserRepository.getByEmail with correct value', async () => {
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
    test('Should call UserRepository.create with correct values', async () => {
      const createSpy = vi.spyOn(mockUserRepository, 'create');

      let signUpParams = mockSignUpParams();

      await sut.signUp(signUpParams);

      signUpParams.password = 'hashed_password';

      expect(createSpy).toHaveBeenCalledWith(signUpParams);
    });
    test('Should call BcryptAdapter with correct value', async () => {
      const hashSpy = vi.spyOn(mockBcryptAdapter, 'hash');

      const signUpParams = mockSignUpParams();

      await sut.signUp(signUpParams);

      expect(hashSpy).toHaveBeenCalledWith(signUpParams.password);
    });
    test('Should throw if UserRepository.getByEmail throws', async () => {
      vi.spyOn(mockUserRepository, 'getByEmail').mockImplementationOnce(() => {
        throw new Error();
      });

      expect(sut.signUp(mockSignUpParams())).rejects.toThrow();
    });
    test('Should throw if BcryptAdapter throws', async () => {
      vi.spyOn(mockBcryptAdapter, 'hash').mockImplementationOnce(() => {
        throw new Error();
      });

      expect(sut.signUp(mockSignUpParams())).rejects.toThrow();
    });

    test('Should throw if UserRepository.create throws', async () => {
      vi.spyOn(mockUserRepository, 'create').mockImplementationOnce(() => {
        throw new Error();
      });

      expect(sut.signUp(mockSignUpParams())).rejects.toThrow();
    });
  });

  describe('login', () => {
    beforeEach(() => {
      vi.spyOn(mockUserRepository, 'getByEmail').mockResolvedValueOnce(
        mockUserModel()
      );
    });

    test('Should call UserRepository.getByEmail with correct value', async () => {
      const getByEmailSpy = vi.spyOn(mockUserRepository, 'getByEmail');

      await sut.login(mockLoginParams());

      expect(getByEmailSpy).toHaveBeenCalledWith(mockLoginParams().email);
    });

    test('Should throw UnauthorizedError if userRepository.getByEmail returns null', async () => {
      vi.spyOn(mockUserRepository, 'getByEmail').mockResolvedValueOnce(null);

      expect(sut.login(mockLoginParams())).rejects.toThrow(UnauthorizedError);
    });

    test('Should call BcryptAdapter.compare with correct values', async () => {
      const compareSpy = vi.spyOn(mockBcryptAdapter, 'compare');

      const loginParams = mockLoginParams();

      const userModel = mockUserModel();

      await sut.login(loginParams);

      expect(compareSpy).toHaveBeenCalledWith(
        loginParams.password,
        userModel.password
      );
    });

    test('Should throw UnauthorizedError if BcryptAdapter.compare returns false', async () => {
      vi.spyOn(mockBcryptAdapter, 'compare').mockResolvedValueOnce(false);

      expect(sut.login(mockLoginParams())).rejects.toThrow(UnauthorizedError);
    });

    test('Should call jwtAdapter.encode with correct value', async () => {
      const encodeSpy = vi.spyOn(mockJwtAdapter, 'encode');

      await sut.login(mockLoginParams());

      expect(encodeSpy).toHaveBeenCalledWith({ id: mockUserModel().id });
    });

    test('Should return token and user on success', async () => {
      const result = await sut.login(mockLoginParams());

      expect(result).toStrictEqual({
        token: 'encoded_value',
        user: {
          id: 1,
          email: 'any_email',
          name: 'any_name',
        },
      });
    });

    test('Should throw if bcryptAdapter throws', async () => {
      vi.spyOn(mockBcryptAdapter, 'compare').mockImplementationOnce(() => {
        throw new Error();
      });

      expect(sut.login(mockLoginParams())).rejects.toThrow();
    });
  });
});
