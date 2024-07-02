import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { PrismaService } from '../../db/prisma.service';
import { Request } from 'express';
import { Role } from '@prisma/client';
import { GroupsErrorsEnum } from '../../constants/errors/groups.errors';

@Injectable()
export class GroupsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(req: Request, dto: CreateGroupDto) {
    const mentorCheck = await this.prismaService.userOrganisation.findFirst({
      where: {
        organisation_id: req.user.organisation_id,
        user_id: dto.mentor,
        OR: [{ role: Role.admin }, { role: Role.owner }],
      },
    });

    if (!mentorCheck) {
      throw new BadRequestException(GroupsErrorsEnum.InvalidMentor);
    }
  }
}
