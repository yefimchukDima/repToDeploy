import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class ValidateCodeDTO {
  @ApiProperty()
  @IsString()
  login: string;

  @ApiProperty()
  @IsString()
  code: string;
}
