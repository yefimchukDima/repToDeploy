import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class UserLoginDTO {
  @ApiProperty()
  @IsString()
  mobile_number: string;

  @ApiProperty()
  @IsString()
  password: string;
}
