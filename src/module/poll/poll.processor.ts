import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poll } from './entities/poll.entity';


@Processor('poll')
export class PollProcessor {
    constructor (
        @InjectRepository(Poll)
        private readonly pollRepo: Repository<Poll>
    ) {}
    
    @Process('startPoll')
    async autoStart(id: number, status = 1) {
        return await this.pollRepo.update(id, {
            status: status
        })
    }
}