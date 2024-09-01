import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { Role, UserStatus } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class OrganisationService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdmins(req: Request) {
    const result = await this.prisma.user.findMany({
      where: {
        user_info: {
          OR: [{ role: Role.admin }, { role: Role.owner }],
          organisation_id: req.user.organisation_id,
        },
        user_statuses: {
          status: UserStatus.active,
        },
      },
      select: {
        full_name: true,
        avatar: true,
        id: true,
      },
    });

    return result;
  }

  async getStudentsNotInGroup(req: Request, id: number) {
    const studentsInOrg = await this.prisma.userGroups.findMany({
      where: {
        group_id: id,
      },
    });

    const ids = studentsInOrg.map((item) => item.user_id);

    const result = await this.prisma.user.findMany({
      where: {
        id: {
          notIn: ids,
        },
        user_info: {
          organisation_id: req.user.organisation_id,
          role: Role.student,
        },
        user_statuses: {
          status: UserStatus.active,
        },
      },
      select: {
        full_name: true,
        avatar: true,
        email: true,
        id: true,
      },
    });

    return result;
  }
}
