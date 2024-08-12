import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from '../poll/entities/poll.entity';
import { PollModule } from '../poll/poll.module';
import { VoteModule } from '../vote/vote.module';
import { Item } from './entities/item.entity';
import { ItemController } from './items.controller';
import { ItemService } from './items.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item]),
  PollModule,
  VoteModule,
  CacheModule.register(),
],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService]
})
export class ItemModule {}
