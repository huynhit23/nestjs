import { applyDecorators, CacheModule, SetMetadata, UseGuards } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Role } from './roles/enum';
import { RolesGuard } from './roles/guard';


export function Auth(...roles: Role[]){
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard,RolesGuard),
  );
}
