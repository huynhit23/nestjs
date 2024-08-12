import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { Vote } from './entities/vote.entity';

@Injectable()
export class VoteService {
  // create(createVoteDto: CreateVoteDto) {
  //   return 'This action adds a new vote';
  // }

  // findAll() {
  //   return `This action returns all vote`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} vote`;
  // }

  // update(id: number, updateVoteDto: UpdateVoteDto) {
  //   return `This action updates a #${id} vote`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} vote`;
  // }
  constructor(
    @InjectRepository(Vote)
    private VoteRepository: Repository<Vote>,
    private dataResource: DataSource,
  ) {}

  async findAll(): Promise<Vote[]> {
    return await this.VoteRepository.find();
  }

  async myVote(UserId){
    const user = await this.dataResource
    .getRepository(Vote)
    .createQueryBuilder("vote")
    .innerJoinAndSelect("vote.user","user")
    .innerJoinAndSelect("vote.item","item")
    .where("user.id = :id",{ id: UserId})
    .getMany();
    return user;
  }
}
