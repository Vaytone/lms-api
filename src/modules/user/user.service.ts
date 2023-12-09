import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { CreateUser } from './types/user.types';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUser) {
    return this.prisma.user.create({
      data: {
        login: dto.login,
        active: false,
        closed: false,
        first_name: dto.firstName,
        last_name: dto.lastName,
        password: dto.password,
        role: dto.role,
        organisation_id: dto.organisation_id,
      },
    });
  }

  async getUserByLogin(login: string) {
    return this.prisma.user.findFirst({
      where: {
        login,
      },
    });
  }
}
