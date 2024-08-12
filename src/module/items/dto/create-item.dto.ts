import { IsEmail, IsNotEmpty, Length } from 'class-validator';
export class CreateItemDto {
    
    @IsNotEmpty({ message: 'Tên không được để trống' })
    @Length(5,255, {message: 'Tên trong khoảng từ 5-225 kí tự'})
    name: string;

    @IsNotEmpty({ message: 'Tên không được để trống' })
    @Length(5,255, {message: 'Tên trong khoảng từ 5-225 kí tự'})
    image: string;
 
}
