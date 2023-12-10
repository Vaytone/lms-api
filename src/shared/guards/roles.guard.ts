import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../modules/auth/decorator/role.decorator';
import { AuthErrorsEnum } from '../../constants/errors/auth.errors';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(ROLES_KEY, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const hasAccess = roles.includes(user.role);

    if (hasAccess) return true;

    throw new BadRequestException(AuthErrorsEnum.NoAccess);
  }
}
