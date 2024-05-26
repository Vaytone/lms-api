import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { Request } from 'express';
import { Role, UserStatus } from '@prisma/client';
import { ApplicationsErrorEnum } from '../../constants/errors/applications.error';
import { GetApplicationsQueriesDto } from './dto/get-applications-queries.dto';
import { DefaultErrorsEnum } from '../../constants/errors/default.errors';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(req: Request, { role = 'all', sortBy = 'created_at', query = '', page = 1 }: GetApplicationsQueriesDto) {
    const filters = {
      user_info: {},
      user_statuses: {
        status: UserStatus.pending,
      },
      organisation_id: req.user.organisation_id,
    };

    const orderBy: Record<string, 'desc' | 'asc'>[] = [{ id: 'desc' }];

    if (sortBy && sortBy.trim() !== '') {
      orderBy.unshift({ [sortBy]: 'asc' });
    }

    if (role && role !== 'all') {
      filters.user_info = {
        role,
      };
    }

    const limit = 30;
    let currentPage = Number(page) < 1 ? 1 : Number(page);
    const userCount = await this.prisma.user.count({
      where: {
        ...filters,
        OR: [
          {
            full_name: {
              contains: query.trim(),
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: query.trim(),
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    const pageCount = Math.ceil(userCount / limit) <= 1 ? 1 : Math.ceil(userCount / limit);

    if (pageCount < currentPage) {
      currentPage = pageCount;
    }

    const skip = (currentPage - 1) * limit;

    const result = await this.prisma.user.findMany({
      where: {
        ...filters,
        OR: [
          {
            full_name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        email: true,
        avatar: true,
        first_name: true,
        last_name: true,
        full_name: true,
        created_at: true,
        user_info: {
          select: {
            role: true,
            role_description: true,
          },
        },
        user_statuses: {
          select: {
            status: true,
          },
        },
        message: {
          select: {
            text: true,
          },
        },
      },
      orderBy: orderBy,
      skip,
      take: limit,
    });

    return {
      data: result,
      page: currentPage,
      pageCount,
      hasNextPage: userCount > currentPage * limit,
    };
  }

  async accept(req: Request, id: number) {
    const orgUserCheck = await this.prisma.userOrganisation.findFirst({
      where: {
        organisation_id: req.user.organisation_id,
        user_id: id,
      },
    });

    if (!orgUserCheck) {
      throw new BadRequestException(ApplicationsErrorEnum.ApplicationNotFound);
    }

    const maxRolesMatrix = {
      [Role.admin]: 'max_admin',
      [Role.student]: 'max_student',
      [Role.watcher]: 'max_watcher',
    };

    const roleExcedeedErrorMatrix = {
      [Role.admin]: ApplicationsErrorEnum.AdminLimitExceeded,
      [Role.student]: ApplicationsErrorEnum.StudentLimitExceeded,
      [Role.watcher]: ApplicationsErrorEnum.WatcherLimitExceeded,
    };

    const currentUserCounter = await this.prisma.user.count({
      where: {
        user_statuses: {
          status: UserStatus.active,
          closed: false,
        },
        user_info: {
          role: orgUserCheck.role,
        },
      },
    });

    const { plan } = await this.prisma.organisation.findFirst({
      where: {
        id: req.user.organisation_id,
      },
      include: {
        plan: true,
      },
    });

    if (!plan) {
      throw new ForbiddenException(DefaultErrorsEnum.OrganisationNoPlan);
    }

    if (plan[maxRolesMatrix[orgUserCheck.role]] < currentUserCounter + 1) {
      throw new ForbiddenException(roleExcedeedErrorMatrix[orgUserCheck.role]);
    }

    const userToUpdate = await this.prisma.userStatuses.findFirst({
      where: {
        user_id: id,
        status: 'pending',
      },
    });

    if (!userToUpdate) {
      throw new BadRequestException(ApplicationsErrorEnum.ApplicationNotFound);
    }

    const result = await this.prisma.userStatuses.update({
      where: {
        user_id: id,
        status: UserStatus.pending,
      },
      data: {
        status: UserStatus.active,
      },
    });

    return result;
  }

  async reject(req: Request, id: number) {
    const orgUserCheck = await this.prisma.userOrganisation.findFirst({
      where: {
        organisation_id: req.user.organisation_id,
        user_id: id,
      },
    });

    if (!orgUserCheck) {
      throw new UnauthorizedException(ApplicationsErrorEnum.ApplicationNotFound);
    }

    const userToUpdate = await this.prisma.userStatuses.findFirst({
      where: {
        user_id: id,
        status: 'pending',
      },
    });

    if (!userToUpdate) {
      throw new BadRequestException(ApplicationsErrorEnum.ApplicationNotFound);
    }

    const result = await this.prisma.userStatuses.update({
      where: {
        user_id: id,
        status: UserStatus.pending,
      },
      data: {
        status: UserStatus.rejected,
      },
    });

    return result;
  }

  async revert(req: Request, id: number) {
    const orgUserCheck = await this.prisma.userOrganisation.findFirst({
      where: {
        organisation_id: req.user.organisation_id,
        user_id: id,
      },
    });

    if (!orgUserCheck) {
      throw new UnauthorizedException(ApplicationsErrorEnum.ApplicationNotFound);
    }

    const result = await this.prisma.userStatuses.update({
      where: {
        user_id: id,
      },
      data: {
        status: 'pending',
      },
    });

    return result;
  }
}
