import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, Length } from 'class-validator';
import { CreatePollDto } from './create-new-poll.dto';

export class UpdatePollDto extends PartialType(CreatePollDto) {
    @IsNotEmpty({ message: 'Tên không được để trống' })
    @Length(2,255)
    name: string;

    @IsNotEmpty({ message: "Hãy chọn ngày bắt đầu" })
    start:Date;

    @IsNotEmpty({ message: "hãy chọn ngày kết thúc" })
    end:Date;
    
    @IsNotEmpty()
    status: number
}
