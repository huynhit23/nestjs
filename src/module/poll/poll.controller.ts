import { Controller, Get, Post, Body, Patch, Param, Delete,HttpCode,UsePipes,ValidationPipe, Query, DefaultValuePipe, ParseIntPipe, UseInterceptors, CacheInterceptor, Res, Redirect, Req } from '@nestjs/common';
import { PollService } from './poll.service';
import { UpdatePollDto } from './dto/update-poll.dto';
import { CreatePollDto } from './dto/create-new-poll.dto';
import { Auth } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/roles/enum';
import { Roles } from 'src/auth/roles/decorator';
import { Poll } from './entities/poll.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserDecorator } from '../user/decorator';

@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  // @Auth(Role.ADMIN)
  // @Post('/create')
  // @HttpCode(200) 
  // @UsePipes(ValidationPipe)
  // create(@Body() createPollDto: CreatePollDto) {
  //   return this.pollService.create(createPollDto);
  // }

  @Auth(Role.ADMIN)
  @UseInterceptors(CacheInterceptor)
  @Get('')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 2,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 5,
    @Res() res : any,
    @UserDecorator() user: any
    ){

      limit = limit > 100 ? 100 : limit;
      console.log("cache", 'run')
      const data = await this.pollService.paginate({
        page,
        limit
      });
      console.log("data:", data)
      res.render('poll',{
        data: data,
        page : page,
        limit : limit,
        user: user
      })
  }

  @Get('api')
  async allApi(@Res() res: any) {
    const api = await this.pollService.showAll();
    res.send({
      poll: api.data
    })
  }
  
  @Get('/create')
  async root(@Res() res : any) {
    const user = await this.pollService.findAll();
    res.render('poll/create',{
      user: user,
    })
  }

  @Auth(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollService.findOne(+id)
  }

  @Auth(Role.ADMIN)
  @Post('/create')
  @HttpCode(200) 
  @UsePipes(ValidationPipe)
  @Redirect('/')
  create(@Body() createPollDto: CreatePollDto) {
    return this.pollService.create(createPollDto);
  }


  @Auth(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePollDto: UpdatePollDto) {
    return this.pollService.update(+id, updatePollDto);
  }

  @Auth(Role.ADMIN)
  @Get('edit/:id')
  async editPoll(@Param('id') id: number,@Res() res: any,@UserDecorator() user: any) {
    const poll = await this.pollService.findOne(id);
    res.render('poll/edit',{
      MyUser: user,
      poll: poll
    })
  }

  @Auth(Role.ADMIN)
  @Delete(':id')
  @Redirect('/')
  remove(@Param('id') id: string) {
    return this.pollService.deletePoll(+id);
  }
  @Auth(Role.ADMIN)
  @Get('delete/:id')
  @Redirect('/poll')
  removev(@Param('id') id: string) {
    return this.pollService.deletePoll(+id);
  }

  //api 

  @Get('api/:id')
  async showPollById(@Param('id') id:number,@Res() res: any){
    const name = await this.pollService.findOne(id);
    const itemPerPoll = await this.pollService.findItem(id);    
    res.send({
      name,
      itemPerPoll,
    });
  }

  @Auth(Role.ADMIN)
  @Get('itemPerPoll/:id')
  async listItem(@Param('id') id:number,@Res() res: any,@UserDecorator() user: any){
    const names = await this.pollService.findOne(id);
    const itemPerPoll = await this.pollService.findItem(id);
    
    res.render('poll/detail',{
      user: user,
      names,
      itemPerPoll,
    });
  }
  
  @Get('api/itemPerPoll/:id')
  async apiList(@Param('id') id:number,@Res() res: any,@UserDecorator() user: any){
    const names = await this.pollService.findOne(id);
    const itemPerPoll = await this.pollService.findItem(id);
    
    res.send({
      user: user,
      names,
      itemPerPoll,
    });
  }


  
  @Get('/api/:id')
  findOneapi(@Param('id') id: string) {
    return this.pollService.findOne(+id);
  }
  
}
