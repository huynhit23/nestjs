import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { CreateItemDto } from './create-item.dto';

export class UpdateItemDto extends PartialType(CreateItemDto) {
        @IsNotEmpty({ message: 'Tên không được để trống'})
        name: string;

        @IsNotEmpty({ message: 'Hãy nhập tuổi của bạn'})
        age: number;

        @IsNotEmpty({ message: 'Hãy chọn ảnh của bạn'})
        image: string;

        @IsNotEmpty({ message: 'Hãy nhập địa chỉ của bạn'})
        address: string;

        @IsNotEmpty({ message: 'Hãy nhập số điện thoại của bạn'})
        @MinLength(10, {
            message: 'số điện thoại chưa đủ',
          })
        @MaxLength(10, {
            message: 'số điện thoại tối đa 10 số',
        })
        phone: number;

        @IsNotEmpty({ message: 'Hãy nhập chọn cuộc thi của bạn'})
        pollId: number;
}
