import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRoles } from 'src/module/user/enum/user.enum';
import { UserService } from 'src/module/user/user.service';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (request?.user) {
      const { id } = request.user;
      const user = await this.userService.getUserById(id);
      return user.role === UserRoles.ADMIN;
    }

    return false;
  }
}
