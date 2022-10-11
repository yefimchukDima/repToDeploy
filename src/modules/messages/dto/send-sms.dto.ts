import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class SendSMSDTO {
  @ApiProperty()
  @IsString()
  phone_number: string;

  @ApiProperty()
  @IsString()
  message: string;
}
