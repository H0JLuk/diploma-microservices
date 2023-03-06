import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators';
import { UserRoles } from '../entities';
import { AppRequest } from '../types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user }: AppRequest = context.switchToHttp().getRequest();

    const hasRequiredRole = requiredRoles.some((role) => user.role === role);
    if (hasRequiredRole) return true;
    throw new ForbiddenException(`Для просмотра необходима роль ${requiredRoles[0]}`);
  }
}
