import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createUserDto } from 'src/module/user/dto/createUser.dto';
import { User } from 'src/module/user/entities/user.entity';
import { UserService } from 'src/module/user/user.service';
import { AuthLoginDto } from "./auth-login.dto";
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import {Cache} from 'cache-manager';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
        @Inject(CACHE_MANAGER) 
        private cacheManager: Cache
    ) { }

    public async getAuthenticatedUser(email: string, hashedPassword: string) {
        try {
          const user = await this.userService.findEmail(email);
          const isPasswordMatching = await bcrypt.compare(
            hashedPassword,
            user.password
          );
          if (!isPasswordMatching) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
          }
          user.password = undefined;
          return user;
        } catch (error) {
          throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
      }

    async register (userDto: createUserDto){
        const user = await this.userService.create(userDto);
        return {
            username:user.name,
            email:user.email,
        }
    }

    async validateUser(email): Promise<User>{
        const user = await this.userService.findEmail(email);
        if (!user){
            throw new HttpException('Email không tồn tại',HttpStatus.UNAUTHORIZED);
        }
        return user;
    }

    async login(user: AuthLoginDto){
        const users = await this.userService.findByEmail(user.email, user.password);
        const email = users.email;
        const access_token = this.jwtService.sign({email});
        console.log(access_token)
        return `Authentication=${access_token}; HttpOnly; Path=/; Max-Age=${this.configService.get('EXPRIRESIN')}`
    }

    async loginUser(user: AuthLoginDto){
        const users = await this.userService.findByEmail(user.email, user.password);
        const email = users.email;
        const access_token = this.jwtService.sign({email});
        console.log(access_token)
        return `AuthenticationUser=${access_token}; HttpOnly; Path=/; Max-Age=${this.configService.get('EXPRIRESIN')}`
    }
    
    // private _createToken({email}):any {
    //     const accesstoken = this.jwtService.sign({email})
    //     return {
    //         accesstoken
    //     };
    // }

    public getCookieForLogOut() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }
 }