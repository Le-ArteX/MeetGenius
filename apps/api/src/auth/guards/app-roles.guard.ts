import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppRole } from '../../../../../packages/database/generated/prisma';
import { ROLES_KEY } from '../decorators/app-roles.decorator';

@Injectable()
export class AppRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AppRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // If no user is attached to request, deny access
    if (!user) {
        return false;
    }

    return requiredRoles.some((role) => user.role === role);
  }
}
