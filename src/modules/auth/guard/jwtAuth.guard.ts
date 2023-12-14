import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthErrorsEnum } from '../../../constants/errors/auth.errors';
import { PrismaService } from '../../../db/prisma.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../../shared/decorator/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly prisma: PrismaService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];
      if (bearer !== 'Bearer' || !token) {
        return Promise.reject();
      }
      const user = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET || 'access',
      });

      const userInDb = await this.prisma.user.findFirst({
        where: {
          id: user.id,
        },
      });

      if (!userInDb) {
        throw new BadRequestException({ message: AuthErrorsEnum.NotAuthorized });
      }

      req.user = {
        ...user,
        role: userInDb.role,
      };

      return true;
    } catch (e) {
      throw new BadRequestException({ message: AuthErrorsEnum.NotAuthorized });
    }
  }
}
