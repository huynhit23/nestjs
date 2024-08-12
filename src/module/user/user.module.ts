import { CacheModule, Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { ItemModule } from '../items/items.module';
import { VoteModule } from '../vote/vote.module';
import { Item } from '../items/entities/item.entity';
import { Vote } from '../vote/entities/vote.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [MulterModule.register({ dest: './uploads' }),
    TypeOrmModule.forFeature([User, Item, Vote]),
    ItemModule,
    VoteModule,
    CacheModule.register(),
    forwardRef(() => AuthModule),// Door attempts to inject Lock, despite it not being defined yet.
    // forwardRef makes this possible.
    ],
    controllers: [UserController],
    providers: [UserService, JwtStrategy, AuthService, JwtService],
    exports: [UserService]
})
export class UserModule {
    
}
