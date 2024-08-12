import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles/guard';
import { UserModule } from 'src/module/user/user.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
  forwardRef(() => UserModule),
  PassportModule,
  JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async () => ({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d'}
  })
 }),
  CacheModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    isGlobal: true,
    store: redisStore,
    host: configService.get<string>('REDIS_HOST'),
    port: configService.get<string>('REDIS_PORT'),
    username: configService.get<string>('REDIS_USERNAME'),
    password: configService.get<string>('REDIS_PASSWORD'),
  })
}),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [AuthService]
})
export class AuthModule {}


