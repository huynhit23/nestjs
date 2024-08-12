import { Length, IsEmail ,IsNotEmpty } from "class-validator";

export class updateUserDto  {

    @IsNotEmpty({ message: 'Tên không được để trống' })
    @Length(2,255)
    name: string;

    @IsNotEmpty({ message: 'Email không được để trống' })
    @Length(11,255)
    @IsEmail({ message: 'email không đúng định dạng' })
    email:string;

    @Length(8,100)
    @IsNotEmpty({ message: 'password không được để trống' })
    password: string


}