import { Body, Controller, Get, HttpCode, Post, Delete, UsePipes, Param, ValidationPipe, Patch, UploadedFile, UseInterceptors, Render, UseGuards, CacheInterceptor, Query, DefaultValuePipe, ParseIntPipe, Res, Req, Redirect } from '@nestjs/common';
import { updateUserDto } from './dto/updateUser.dto';
import { loginUserDto } from './dto/loginUser.dto';
import { createUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/roles/decorator';
import { Role } from 'src/auth/roles/enum';
import { RolesGuard } from 'src/auth/roles/guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Auth } from 'src/auth/auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserDecorator } from './decorator';
import { response } from 'express';


@Controller('user')
export class UserController {
    constructor(private userService: UserService){
      
    }

    // @Auth(Role.ADMIN)
    // @Get('/')
    // @UseInterceptors(CacheInterceptor)
    // getUsers(
    //   @UserDecorator() user,@Res() res,
    //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    //   @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 5,
    // ): Promise<Pagination<User>>  {
    //   limit = limit > 100 ? 100 : limit;
    //   console.log("cache:", 'run' )
      
    //   res.render('index',{
    //     name: user.name,
    //     user: user,
    //     users: user.data,
    //     paginate: user.total,
    //     page: user.page,
    //   }); 

    //   return this.userService.paginate({
    //     page,
    //     limit,
    //   });
    // }
    @Auth(Role.ADMIN)
    @Get('/')
    @UseInterceptors(CacheInterceptor)
    async getUsers(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 2,
      @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 5,
      @Res() res : any
    )  {
      limit = limit > 100 ? 100 : limit; 
      const data =  await this.userService.paginate({
        page,
        limit,       
      });
      res.render('user',{
        data: data,
        page : page,
        limit : limit,
      })
    }

    @Get('/create')
    root(@Res() res: any) {
      return res.render('user/create')
    }
    
    //get by id 
    @Auth(Role.ADMIN)
    @Get(':id')
    findOne(@Param('id') id:string ){
        return this.userService.findOneById(id);
    }
    
    @Get(':id/get-with-cache')
    @UseInterceptors(CacheInterceptor)
    TestCache(@Param('id') id:string ){
      console.log('run here');
      return this.userService.findOneById(id);
    }

    @Auth(Role.ADMIN)
    @Get('myVote/:id')
    async myVote(@Param('id') id:number,@Res() res: any,@UserDecorator() user: any){
    const history = await this.userService.myVote(id)
    console.log(history);
    
    res.render('voted',{
      user: user,
      history,
    });
  }

    //api
    @Get('/api/all')
    @UseInterceptors(CacheInterceptor)
     getUserss(){
        return this.userService.findAll();
      }
  

    @Post('/create')
    @Redirect('/user')
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
      
    create(@Body() createUserDto: createUserDto,@UploadedFile() file: Express.Multer.File) {
        createUserDto.image = file.filename;
       
        return this.userService.create(createUserDto);
    }

    // @Post('/create')
    // @HttpCode(200)
    // @UsePipes(ValidationPipe)  
    // async register(@Body() UserCreate: createUserDto){
    //   return this.userService.create(UserCreate)
    // }

    @Post('/create')
    @HttpCode(200)
    @UsePipes(ValidationPipe)  
    async register(@Body() UserCreate: createUserDto){
      return this.userService.create(UserCreate)
    }
    
    @Delete(':id')
    remove(@Param('id') id: number){
        return this.userService.remove(+id);
    }

    @Get('delete/:id')
    @Redirect('/user')
    removeView(@Param('id') id: number){
      return this.userService.remove(+id);
    }

    @Patch(':id')
    updateUser(@Param('id') id:number, @Body() updateUserDto:updateUserDto){
        return this.userService.update(+id, updateUserDto);
    }

    @Auth(Role.USER)
    @Post('vote/:itemId')
    async vote(
      @Param('itemId') itemId: number,
      @UserDecorator() user,
    ) {
      console.log(itemId)
      return await this.userService.vote(itemId, user)
    }

    @Auth(Role.ADMIN)
    @Post('/addMoney/:id/:amount')
    addMoney(@Param('id') id: number,@Param('amount') amount: number): Promise<User> {
      console.log("amount: ", amount)
      return this.userService.addMoney(id, amount)
    }
}