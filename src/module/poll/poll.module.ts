import { CacheModule, Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { ScheduleModule } from '@nestjs/schedule';


import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from './entities/poll.entity';
import { Item } from '../items/entities/item.entity';
import { Vote } from '../vote/entities/vote.entity';
import { PollGateway } from './poll.gateway';
import { BullModule } from '@nestjs/bull';
import { PollProcessor } from './poll.processor';
@Module({
  imports: [TypeOrmModule.forFeature([Poll, Item, Vote]),
    ScheduleModule.forRoot(),
    CacheModule.register(),
    BullModule.registerQueue({name: 'poll'}),
  ],
  controllers: [PollController],
  providers: [PollService],
  exports: [PollService]
})
export class PollModule {}
