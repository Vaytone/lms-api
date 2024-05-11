import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { Request } from 'express';
import { UserStatus } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  get(req: Request, { role, sortBy, query }) {
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
        user_info: {
          select: {
            role: true,
            role_description: true,
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
}
