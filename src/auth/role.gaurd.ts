import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_MESSAGE, UserRole } from '../utils/constant';

@Injectable()
export class RoleGaurd implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );
    console.log(requiredRoles);
    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();
    if (!user || !requiredRoles?.includes(user?.role)) {
      throw new ForbiddenException(AUTH_MESSAGE.PERMISSION_ERROR);
    }
    return true;
  }
}
