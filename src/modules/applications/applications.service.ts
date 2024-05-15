import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { Request } from 'express';
import { UserStatus } from '@prisma/client';
import { ApplicationsErrorEnum } from '../../constants/errors/applications.error';
import { GetApplicationsQueriesDto } from './dto/get-applications-queries.dto';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  get(req: Request, { role, sortBy, query }: GetApplicationsQueriesDto) {
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

    const result = this.prisma.user.findMany({
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
    });

    return result;
  }

  async accept(req: Request, id: number) {
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
        status: 'active',
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

    const result = await this.prisma.userStatuses.update({
      where: {
        user_id: id,
      },
      data: {
        status: 'rejected',
      },
    });

    return result;
  }
}
