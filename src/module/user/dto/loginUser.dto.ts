import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class loginUserDto {
    @IsNotEmpty({message: "Email không được để trống"})
    @IsEmail({messenge: "Email không đúng định dạng"})
    email:string;

    @IsNotEmpty({message: "Mật khẩu không được để trống"})
    @Length(5,100, {message: "Mật khẩu trong khoảng từ 5-100 kí tự"})
    password:string;


}