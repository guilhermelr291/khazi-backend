import { User } from '@prisma/client';
import { BcryptAdapter } from '../../../common/adapters/cryptography/bcrypt-adapter';
import {
  BadRequestError,
  UnauthorizedError,
} from '../../../common/errors/http-errors';
import { UserRepository } from '../../user/repository/user-repository';
import { JwtAdapter } from '../../../common/adapters/cryptography/jwt-adapter';

export type SignUpParams = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
};

export type LoginParams = {
  email: string;
  password: string;
};

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly jwtAdapter: JwtAdapter
  ) {
    this.userRepository = userRepository;
    this.bcryptAdapter = bcryptAdapter;
  }

  async signUp(data: SignUpParams): Promise<User> {
    const { email, password } = data;
    const user = await this.userRepository.getByEmail(email);
    if (user) throw new BadRequestError('Email is already in use');

    const hashedPassword = await this.bcryptAdapter.hash(password);

    const createdUser = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return createdUser;
  }

  async login(data: LoginParams): Promise<{ token: string; user: any }> {
    const { email, password } = data;
    const user = await this.userRepository.getByEmail(email);
    if (!user) throw new UnauthorizedError();

    const passwordMatches = await this.bcryptAdapter.compare(
      password,
      user.password
    );

    if (!passwordMatches) throw new UnauthorizedError();

    const token = await this.jwtAdapter.encode({ id: user.id });

    const { password: pass, ...userToReturn } = user;

    return { token, user: userToReturn };
  }
}
