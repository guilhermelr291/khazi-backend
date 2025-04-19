import { AuthController } from '../../../modules/auth/controller/auth-controller';
import { AuthService } from '../../../modules/auth/service/auth-service';
import { CompareFieldsValidation } from '../../../modules/auth/validations/sign-up/compare-fields-validation';
import { UserRepository } from '../../../modules/user/repository/user-repository';
import { BcryptAdapter } from '../../adapters/cryptography/bcrypt-adapter';
import { JwtAdapter } from '../../adapters/cryptography/jwt-adapter';

export const makeAuthController = (): AuthController => {
  const userRepository = new UserRepository();

  const bcryptAdapter = new BcryptAdapter(12);

  const jwtAdapter = new JwtAdapter();

  const authService = new AuthService(
    userRepository,
    bcryptAdapter,
    bcryptAdapter,
    jwtAdapter
  );

  const compareFieldsValidation = new CompareFieldsValidation(
    'password',
    'confirmPassword'
  );

  return new AuthController(authService, compareFieldsValidation);
};
