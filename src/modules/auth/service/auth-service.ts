import { User } from '@prisma/client';

import {
  BadRequestError,
  UnauthorizedError,
} from '../../../common/factories/errors/http-errors';
import { UserRepository } from '../../user/repository/user-repository';

import { Hasher } from '../protocols/hasher';
import { HashComparer } from '../protocols/hash-comparer';
import { Encrypter } from '../protocols/encrypter';

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
    private readonly hasher: Hasher,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) {
    this.userRepository = userRepository;
    this.hasher = hasher;
    this.hashComparer = hashComparer;
    this.encrypter = encrypter;
  }

  async signUp(data: SignUpParams): Promise<User> {
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

  async login(data: LoginParams): Promise<{ token: string; user: any }> {
    const { email, password } = data;
    const user = await this.userRepository.getByEmail(email);
    if (!user) throw new UnauthorizedError();

    const passwordMatches = await this.hashComparer.compare(
      password,
      user.password
    );

    if (!passwordMatches) throw new UnauthorizedError();

    const token = await this.encrypter.encrypt({ id: user.id });

    const { password: pass, ...userToReturn } = user;

    return { token, user: userToReturn };
  }
}
