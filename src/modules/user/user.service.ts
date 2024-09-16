import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { CreateUser, UserDetails } from './types/user.types';
import { SignInDto } from '../auth/dto/sign-in.dto';
import * as bcrypt from 'bcryptjs';
import { InvalidDataException } from '../../exceptions/invalidData.exception';
import { AuthErrorsEnum } from '../../constants/errors/auth.errors';
import { DefaultErrorsEnum } from '../../constants/errors/default.errors';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUser) {
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        first_name: dto.firstName,
        last_name: dto.lastName,
        password: dto.password,
        full_name: `${dto.firstName} ${dto.lastName}`,
        organisation: {
          connect: {
            id: dto.organisation_id,
          },
        },
        avatar: dto.avatar,
      },
    });

    if (dto.greetingMessage) {
      await this.prisma.userGreetingMessage.create({
        data: {
          user_id: user.id,
          text: dto.greetingMessage,
        },
      });
    }

    await this.prisma.userStatuses.create({
      data: {
        status: 'pending',
        closed: false,
        user_id: user.id,
      },
    });

    await this.prisma.userOrganisation.create({
      data: {
        user_id: user.id,
        organisation_id: dto.organisation_id,
        role: dto.role,
      },
    });

    return this.getUserByEmail(user.email);
  }

  async validateUser(dto: SignInDto) {
    console.log(dto);
    const user: UserDetails = await this.getUserByEmail(dto.email);
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

  async getUserByEmail(email: string) {
    if (!email) {
      throw new BadRequestException(DefaultErrorsEnum.SomethingWentWrong);
    }

    return this.prisma.user.findFirst({
      where: {
        email: email,
      },
      include: {
        organisation: true,
        user_info: true,
        user_statuses: true,
        message: true,
      },
    });
  }
}
