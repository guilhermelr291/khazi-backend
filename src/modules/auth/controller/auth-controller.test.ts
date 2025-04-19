import { beforeEach, describe, expect, test, vi } from 'vitest';
import { AuthController } from './auth-controller';
import { AuthService } from '../service/auth-service';
import { NextFunction, Request, Response } from 'express';
import { FieldComparer } from '../protocols/fields-comparer';
import { HttpError } from '../../../common/errors/http-errors';

const mockAuthService = {
  signUp: vi.fn(),
  login: vi.fn().mockResolvedValue({
    token: 'any_token',
    user: { id: 1, name: 'any_name', email: 'any_email' },
  }),
} as unknown as AuthService;

class FieldComparerStub implements FieldComparer {
  compare(data: any): HttpError | void {}
}

describe('AuthController', () => {
  let sut: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let fieldComparerStub = new FieldComparerStub();

  beforeEach(() => {
    vi.clearAllMocks();

    sut = new AuthController(mockAuthService, fieldComparerStub);

    mockRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        confirmPassword: 'any_password',
      },
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    mockNext = vi.fn();
  });

  describe('signUp', () => {
    test('Should call FieldComparer with correct data', async () => {
      const validateSpy = vi.spyOn(fieldComparerStub, 'compare');

      await sut.signUp(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(validateSpy).toHaveBeenCalledWith(mockRequest.body);
    });

    test('Should call AuthService with correct data', async () => {
      const signUpSpy = vi.spyOn(mockAuthService, 'signUp');

      await sut.signUp(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(signUpSpy).toHaveBeenCalledWith(mockRequest.body);
    });

    test('Should return 201 on success', async () => {
      await sut.signUp(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    test('Should call next when AuthService throws', async () => {
      const error = new Error();

      vi.spyOn(mockAuthService, 'signUp').mockImplementationOnce(() => {
        throw error;
      });

      await sut.signUp(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    test('Should call next when FieldComparer throws', async () => {
      const error = new Error();

      vi.spyOn(fieldComparerStub, 'compare').mockImplementationOnce(() => {
        throw error;
      });

      await sut.signUp(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('login', () => {
    beforeEach(() => {
      mockRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password',
        },
      };
    });

    test('Should call AuthService.login with correct values', async () => {
      const loginSpy = vi.spyOn(mockAuthService, 'login');

      await sut.login(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(loginSpy).toHaveBeenCalledWith(mockRequest.body);
    });
    test('Should call next if AuthService.login throws', async () => {
      const error = new Error();

      vi.spyOn(mockAuthService, 'login').mockImplementationOnce(() => {
        throw error;
      });

      await sut.login(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    test('Should return status 200 and correct userData on success', async () => {
      await sut.login(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        token: 'any_token',
        user: { id: 1, name: 'any_name', email: 'any_email' },
      });
    });
  });
});
