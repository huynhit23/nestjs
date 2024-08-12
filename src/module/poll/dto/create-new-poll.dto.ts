import{IsNotEmpty, Length} from 'class-validator'
import { Column } from 'typeorm';
export class CreatePollDto {
    @IsNotEmpty({ message: 'Tên không được để trống'})
    @Length(2,255)
    name: string;

    @IsNotEmpty({ message: 'chọn ngày bắt đầu' })
    start: Date
    
    @IsNotEmpty({ message: 'chọn ngày kết thúc' })
    end: Date 
    static start_date: string | number | Date;

}
