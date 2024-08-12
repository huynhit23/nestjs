import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ValidationPipe, UsePipes, HttpCode, Render, CacheInterceptor, Query, ParseIntPipe, DefaultValuePipe, Res, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Auth } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/roles/enum';
import { PollService } from '../poll/poll.service';
import { UserDecorator } from '../user/decorator';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemService } from './items.service';

@Controller('item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly pollService: PollService  
  ) {}

  @Auth(Role.ADMIN)
  @Get('/create')
  async createNewItem(@Res() res: any,@UserDecorator() user: any, @Req() req: any) {
    const poll = await this.pollService.findAll()
    res.render('item/create',{
      user: user,
      poll: poll
    })
  }
  
  @Get('delete/:id')
  delete(@Param('id') id: string,@Res() res: any,@UserDecorator() user: any,) {
    try {
      const candidate = this.itemService.remove(+id);
      res.redirect('/item/show')
    } catch (error) {
      return 'Lỗi rồi'
    }
  }
  
  @Auth(Role.ADMIN)
  @Get('show')
  async show(@Res() res: any ,@UserDecorator() user: any) {
    const item = await this.itemService.showItem()
    res.render('item/index',{
      user: user,
      item: item,
      total: item.length
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }
  
 

  @Post('/create')
  @HttpCode(200) 
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  create(@Body() createitemDto: CreateItemDto,@Res() res: any,@UploadedFile() file: Express.Multer.File) {
    createitemDto.image = file.filename;
    console.log(createitemDto)
    const item = this.itemService.create(createitemDto);
    if(!item){
      return 'KO tạo được'
    } else {
      res.redirect('/item/show')
    }
  }
  
    

  @Auth(Role.ADMIN)
  @Get('edit/:id')
  async editItem(@Param('id') id: number,@Res() res: any,@UserDecorator() user: any) {
    const poll = await this.pollService.findAll()
    const item = await this.itemService.findOne(id);
    res.render('item/edit',{
      user: user,
      item: item,
      poll: poll
    })
  }

  @Auth(Role.ADMIN)
  @Post('edit/item/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async updateItem(@Param('id') id: number,@Res() res: any,@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    if(file != null) {
      req.body.image = file.filename;
    }
    const item = await this.itemService.update(id, req.body);
    res.redirect('/item/show')

  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(+id, updateItemDto);
  }

  @Get('delete/:id')
  removev(@Param('id') id: string) {
    console.log(id);
    return this.itemService.remove(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }

  //api
  @Get('/api/all')
  all() {
    return this.itemService.findAll();
    
  }
  
  @Get('/api/:id')
  findOneapi(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }
}
