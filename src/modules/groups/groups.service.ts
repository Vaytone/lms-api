import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { PrismaService } from '../../db/prisma.service';
import { Request } from 'express';
import { GroupRole, Role } from '@prisma/client';
import { GroupsErrorsEnum } from '../../constants/errors/groups.errors';
import { GetGroupsQueriesDto } from './dto/get-groups-queries.dto';
import { AuthErrorsEnum } from '../../constants/errors/auth.errors';
import { AddStudentsDto } from './dto/add-students.dto';

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(req: Request, { query = '', page = 1 }: GetGroupsQueriesDto) {
    const filters = {
      organisation_id: req.user.organisation_id,
    };

    const orderBy: Record<string, 'desc' | 'asc'>[] = [{ id: 'desc' }];

    const limit = 120;
    let currentPage = Number(page) < 1 ? 1 : Number(page);
    const groupCount = await this.prisma.group.count({
      where: {
        ...filters,
        OR: [
          {
            name: {
              contains: query.trim(),
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    const pageCount = Math.ceil(groupCount / limit) <= 1 ? 1 : Math.ceil(groupCount / limit);

    if (pageCount < currentPage) {
      currentPage = pageCount;
    }

    const skip = (currentPage - 1) * limit;

    const result = await this.prisma.group.findMany({
      where: {
        ...filters,
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        name: true,
        users: {
          select: {
            role: true,
            user: {
              select: {
                id: true,
                avatar: true,
                full_name: true,
              },
            },
          },
        },
        id: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: orderBy,
      skip,
      take: limit,
    });

    return {
      data: result,
      page: currentPage,
      pageCount,
      hasNextPage: groupCount > currentPage * limit,
    };
  }

  async getGroupById(req: Request, id: number) {
    const isUserInGroup = await this.prisma.userGroups.findFirst({
      where: {
        user_id: req.user.id,
        group_id: id,
      },
    });

    if (!isUserInGroup && req.user.role !== Role.owner) {
      throw new UnauthorizedException(AuthErrorsEnum.NoAccess);
    }

    const result = await this.prisma.group.findFirst({
      where: {
        id,
      },
      select: {
        name: true,
        users: {
          select: {
            role: true,
            user: {
              select: {
                id: true,
                avatar: true,
                full_name: true,
                first_name: true,
              },
            },
          },
        },
        id: true,
        created_at: true,
        updated_at: true,
      },
    });

    return result;
  }

  async create(req: Request, dto: CreateGroupDto) {
    const mentorCheck = await this.prisma.userOrganisation.findFirst({
      where: {
        organisation_id: req.user.organisation_id,
        user_id: dto.mentor,
        OR: [{ role: Role.admin }, { role: Role.owner }],
      },
    });

    if (!mentorCheck) {
      throw new BadRequestException(GroupsErrorsEnum.InvalidMentor);
    }

    const createdGroup = await this.prisma.group.create({
      data: {
        organisation_id: req.user.organisation_id,
        name: dto.name,
        users: {
          create: {
            user_id: dto.mentor,
            role: GroupRole.admin,
          },
        },
      },
    });

    return createdGroup;
  }

  async addStudents(req: Request, dto: AddStudentsDto, id: number) {
    const isUserMentor = await this.prisma.userGroups.findFirst({
      where: {
        user_id: req.user.id,
        group_id: id,
        role: GroupRole.admin,
      },
    });

    if (!isUserMentor && req.user.role !== Role.owner) {
      throw new UnauthorizedException(AuthErrorsEnum.NoAccess);
    }

    const checkIds = await this.prisma.userOrganisation.findMany({
      where: {
        user_id: {
          in: dto.ids,
        },
        organisation_id: req.user.organisation_id,
      },
    });

    if (checkIds.length !== dto.ids.length) {
      throw new BadRequestException(GroupsErrorsEnum.InvalidStudents);
    }

    const userAlreadyInGroup = await this.prisma.userGroups.findMany({
      where: {
        group_id: id,
      },
      select: {
        user_id: true,
      },
    });

    const userInGroupIds = userAlreadyInGroup.map((item) => item.user_id);
    const userToAdd = dto.ids.filter((item) => !userInGroupIds.includes(item));

    const data = userToAdd.map((studId) => ({
      user_id: studId,
      group_id: id,
      role: GroupRole.member,
    }));

    await this.prisma.userGroups.createMany({
      data,
      skipDuplicates: true,
    });

    return this.prisma.userGroups.findMany({
      where: {
        group_id: id,
        user_id: {
          in: userToAdd,
        },
      },
      select: {
        role: true,
        user: {
          select: {
            id: true,
            avatar: true,
            full_name: true,
            first_name: true,
          },
        },
      },
    });
  }
}
