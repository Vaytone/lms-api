import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../db/prisma.service';
import { AuthErrorsEnum } from '../../../constants/errors/auth.errors';
import { IS_FREE_ACCESS_KEY } from '../../../shared/decorator/freeAccess.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class OrganisationActiveStatusGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const userFromJwtGuard = request.user;

      const isFreeAccess = this.reflector.getAllAndOverride<boolean>(IS_FREE_ACCESS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (isFreeAccess) {
        return true;
      }

      if (userFromJwtGuard) {
        const userInDb = await this.prisma.user.findFirst({
          where: {
            id: userFromJwtGuard.id,
          },
          include: {
            organisation: true,
          },
        });

        if (userInDb.organisation.active) {
          return true;
        }
        throw new BadRequestException({ message: AuthErrorsEnum.NotAuthorized });
      }
      throw new BadRequestException({ message: AuthErrorsEnum.NotAuthorized });
    } catch (e) {
      throw new BadRequestException({ message: AuthErrorsEnum.OrganisationIsInactive });
    }
  }
}
