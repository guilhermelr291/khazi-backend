import { AuthController } from '../../../modules/auth/controller/auth-controller';
import { AuthService } from '../../../modules/auth/service/auth-service';
import { CompareFieldsValidation } from '../../../modules/auth/validations/sign-up/compare-fields-validation';
import { UserRepository } from '../../../modules/user/repository/user-repository';
import { BcryptAdapter } from '../../adapters/bcrypt-adapter';

export const makeAuthController = (): AuthController => {
  const userRepository = new UserRepository();

  const hasher = new BcryptAdapter(12);

  const authService = new AuthService(userRepository, hasher);

  const compareFieldsValidation = new CompareFieldsValidation(
    'password',
    'confirmPassword'
  );

  return new AuthController(authService, compareFieldsValidation);
};
