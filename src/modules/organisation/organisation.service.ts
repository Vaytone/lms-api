import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { Role } from '@prisma/client';
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
      },
      select: {
        full_name: true,
        avatar: true,
        id: true,
      },
    });

    return result;
  }
}
