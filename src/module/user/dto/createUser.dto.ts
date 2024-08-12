import { IsEmail, IsNotEmpty, Length } from 'class-validator';
export class createUserDto{
    @IsNotEmpty({ message: 'Tên không được để trống' })
    @Length(5,255, {message: 'Tên trong khoảng từ 5-225 kí tự'})
    name: string;

    @IsNotEmpty({message: 'Email không được để trống'})
    @IsEmail({},{  message: 'Email không đúng định dạng' })
    @Length(11,255, {message: 'Email trong khoảng 11-225 kí tự'})
    email:string;

    @Length(5,100, {message: 'Mật khẩu phải từ 5-100 kí tự'})
    @IsNotEmpty({message: 'Mật khẩu không được để trống'})
    password: string

    @IsNotEmpty({ message: 'img không được để trống' })
    @Length(5,255, {message: 'img trong khoảng từ 5-225 kí tự'})
    image: string;
   
}