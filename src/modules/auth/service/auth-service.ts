import { BcryptAdapter } from '../../../common/adapters/bcrypt-adapter';
import { BadRequestError } from '../../../common/errors/http-errors';
import { UserRepository } from '../../user/repository/user-repository';

export type SignUpParams = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
};

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hasher: BcryptAdapter
  ) {
    this.userRepository = userRepository;
    this.hasher = hasher;
  }

  async signUp(data: SignUpParams) {
    const { email, password } = data;
    const user = await this.userRepository.getByEmail(email);
    if (user) throw new BadRequestError('Email is already in use');

    const hashedPassword = await this.hasher.hash(password);

    const createdUser = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return createdUser;
  }
}
