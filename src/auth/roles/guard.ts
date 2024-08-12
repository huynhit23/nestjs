import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './decorator';
import { Role } from './enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
     
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log(requiredRoles)
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    const check = requiredRoles.some((role) => user.role?.includes(role));
    console.log(check)
    return check;

  }

}