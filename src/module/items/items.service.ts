import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions,paginate, Pagination } from 'nestjs-typeorm-paginate';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    private dataResource: DataSource,
  ) {
  }
  create(createItemDto: CreateItemDto): Promise<Item> {
    console.log(createItemDto)
    return this.itemRepository.save(createItemDto);
  }
 

  findAll() : Promise<Item[]> {
    return this.itemRepository.find();
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Item>> {
    const queryBuilder = this.itemRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.name', 'DESC'); // orderBy name 
  
    return paginate<Item>(queryBuilder, options);
  }

  async showItem() {
    const data = await this.dataResource.getRepository(Item)
    .createQueryBuilder("item")
    .innerJoinAndSelect("item.poll","poll")
    .cache(true)
    .getMany();
    return data
  }

  findOne(id: number) : Promise<Item> {
    return this.itemRepository.findOneBy({ id });
  }

  update(id: number, updateItemDto: UpdateItemDto): Promise<UpdateResult> {
    return this.itemRepository.update(id, updateItemDto);
  }

  remove(id: number) {
    return this.itemRepository.delete({ id });
  }

  async vote(id:number){
    const item = await this.itemRepository.findOne({where: {id}})
    console.log("item", item);
    
    let vote = item.voteQtt ++
    if( vote == 1){
      return await  this.itemRepository.save(item);
    }else{
      return 'không thành công'
    }
  }

  async updateVote(itemId:number){
    
    const voteQtt = await this.findOne(itemId)
    
    const voteQttUpdate = voteQtt.voteQtt += 1;
    console.log("voteQttUpdate", voteQttUpdate);
    
    return await this.itemRepository.update(itemId,{
      voteQtt: voteQttUpdate
    })
  }

}
