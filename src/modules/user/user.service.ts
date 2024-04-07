import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { CreateUser, UserWithOrg } from './types/user.types';
import { SignInDto } from '../auth/dto/sign-in.dto';
import * as bcrypt from 'bcryptjs';
import { InvalidDataException } from '../../exceptions/invalidData.exception';
import { AuthErrorsEnum } from '../../constants/errors/auth.errors';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUser) {
    const user = await this.prisma.user.create({
      data: {
        login: dto.login,
        status: 'pending',
        closed: false,
        first_name: dto.firstName,
        last_name: dto.lastName,
        password: dto.password,
        role: dto.role,
        organisation_id: dto.organisation_id,
        avatar: dto.avatar,
      },
    });

    return this.getUserByLogin(user.login);
  }

  async validateUser(dto: SignInDto) {
    console.log(dto);
    const user: UserWithOrg = await this.getUserByLogin(dto.login);
    console.log(user);
    try {
      const isPasswordCorrect = await bcrypt.compare(dto.password, user.password);
      if (user && isPasswordCorrect) {
        return user;
      }
    } catch {
      throw new InvalidDataException(AuthErrorsEnum.WrongLoginPassword);
    }
    throw new InvalidDataException(AuthErrorsEnum.WrongLoginPassword);
  }

  async getUserByLogin(login: string) {
    return this.prisma.user.findFirst({
      where: {
        login,
      },
      include: {
        organisation: true,
      },
    });
  }
}
