import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class VerificationCodeDTO {
  @ApiProperty()  
  @IsString()
  code: string;
}