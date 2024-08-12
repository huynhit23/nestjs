import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';
import { PollModule } from './module/poll/poll.module';
import { ItemModule } from './module/items/items.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { VoteModule } from './module/vote/vote.module';

import * as redisStore from 'cache-manager-redis-store';
// import { LocalStrategy } from './auth/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { BullModule } from '@nestjs/bull';
import { PollService } from './module/poll/poll.service';



@Module({
  imports: [PollModule, UserModule, TypeOrmModule.forRoot(typeormConfig), ItemModule, 
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>{
        return  ({
          redis: {
            host: configService.get('REDIS_HOST'),
            port: Number(configService.get('REDIS_PORT')),
          },
        })
      },
      inject: [ConfigService]
    }),

    
    CacheModule.registerAsync({
      imports: [
        ConfigModule,    
      ],
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
    VoteModule,
    PassportModule
  ],
  controllers: [AppController,],
  providers: [AppService],
})

export class AppModule {}
