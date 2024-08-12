import {
  Controller, Get, Post, UseGuards, Body, HttpCode,
  UsePipes, ValidationPipe, Render, Req, Res, Redirect, Param, 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthLoginDto } from './auth/auth-login.dto';
import { Auth } from './auth/auth.decorator';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { JwtStrategy } from './auth/jwt.strategy';
import { Roles } from './auth/roles/decorator';
import { Role } from './auth/roles/enum';
import { RolesGuard } from './auth/roles/guard';
import { createUserDto } from './module/user/dto/createUser.dto';
import { UserService } from './module/user/user.service';
import { Request, response, Response } from 'express';
import RequestWithUser from './auth/requestWithUser.interface';
import { request } from 'http';
import { UserDecorator } from './module/user/decorator';
import { send } from 'process';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private userService: UserService
  ) { }

  @HttpCode(200)
  @UseGuards(JwtStrategy)
  @Post('api/log-in')
  async apilogIn(@Req() req: Request, @Res() res: any) {
    const cookie = this.authService.loginUser(req.body);
    res.setHeader('Set-Cookie', await cookie);
    req.body.password = undefined;
    res.send({  
      user: req.body
    })
  }

  @Auth(Role.ADMIN)
  @Get('/')
  @Render('index')
  async homePage(@UserDecorator() user: any,@Req() req: Request) {
    return {
      user: user,
    }
  }

  @Get('log-in')
  @Render('login')
  async logInUser() {}

  @HttpCode(200)
  @UseGuards(JwtStrategy)
  @Post('log-in')
  @Redirect('/')
  async logIn(@Req() req: Request, @Res() res: Response) {
    const cookie = this.authService.login(req.body);
    res.setHeader('Set-Cookie', await cookie);
    req.body.password = undefined;
    return {}
  }

 

  @Auth(Role.ADMIN)
  @Get('profile')
  @Render('index')
  async Info(@UserDecorator() user: any) {
   return { user: user}
  }

  @Auth(Role.USER)
  @Get('api/profile')
  async ApiInfo(@UserDecorator() user: any,@Res() res: Response) {
    res.send({
      user: user,
    })
  }

  @Post('register')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async createAdmin(@Body() userCreate: createUserDto) {
    return await this.userService.create(userCreate);
  }


  @Auth(Role.ADMIN)
  @Get('log-out')
  async logout( @Res() res: Response ) {
    res.setHeader('Set-Cookie', await this.authService.getCookieForLogOut())
    return res.redirect('/');
  }
}
