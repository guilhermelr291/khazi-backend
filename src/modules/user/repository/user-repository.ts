import prisma from '../../../prisma/db';
import { SignUpParams } from '../../auth/service/auth-service';

export class UserRepository {
  async getByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  }
  async create(data: SignUpParams) {
    const { confirmPassword, ...dataToBd } = data;
    const user = await prisma.user.create({ data: dataToBd });
    return user;
  }
}
