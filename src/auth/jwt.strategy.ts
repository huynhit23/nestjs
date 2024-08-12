import { HttpException, Injectable, HttpStatus } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";
import { Request } from 'express';
import { ConfigService } from "@nestjs/config";
import { UserService } from "src/module/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromExtractors([(request: Request) => {
                    return request?.cookies?.Authentication;
                  }]),
                  ExtractJwt.fromExtractors([(request: Request) => {
                    return request?.cookies?.AuthenticationUser;
                  }]),
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        });
    }

    // async validate({email}) {
    //     const user = await this.authService.validateUser(email)
    //     if(!user){
    //         throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED)
    //     }
    //     return user;
    // }

    async validate({email}) {
        const user = await this.authService.validateUser(email);
        if(!user) {
            throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED)
        }
        return user;
      }
}