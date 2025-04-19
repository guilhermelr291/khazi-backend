import { AuthController } from '../../../modules/auth/controller/auth-controller';
import { AuthService } from '../../../modules/auth/service/auth-service';
import { FieldsComparer } from '../../validations/field-comparer';
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

  const compareFieldsValidation = new FieldsComparer(
    'password',
    'confirmPassword'
  );

  return new AuthController(authService, compareFieldsValidation);
};
