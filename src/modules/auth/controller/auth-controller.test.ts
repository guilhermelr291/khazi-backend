import { beforeEach, describe, expect, test, vi } from 'vitest';
import { AuthController } from './auth-controller';
import { AuthService } from '../service/auth-service';
import { CompareFieldsValidation } from '../validations/sign-up/compare-fields-validation';
import { NextFunction, Request, Response } from 'express';

const mockAuthService = {
  signUp: vi.fn(),
  login: vi.fn().mockResolvedValue({
    token: 'any_token',
    user: { id: 1, name: 'any_name', email: 'any_email' },
  }),
} as unknown as AuthService;

const mockCompareFieldsValidation = {
  validate: vi.fn(),
} as unknown as CompareFieldsValidation;

describe('AuthController', () => {
  let sut: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    sut = new AuthController(mockAuthService, mockCompareFieldsValidation);

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
    test('Should call CompareFieldsValidation with correct data', async () => {
      const validateSpy = vi.spyOn(mockCompareFieldsValidation, 'validate');

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

    test('Should call next when CompareFieldsValidation throws', async () => {
      const error = new Error();

      vi.spyOn(mockCompareFieldsValidation, 'validate').mockImplementationOnce(
        () => {
          throw error;
        }
      );

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
