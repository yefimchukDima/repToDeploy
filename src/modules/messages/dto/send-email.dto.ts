import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export default class SendEmailDTO {
  @ApiProperty({
    example: 'email@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    examples: ['example', '{key: value}'],
  })
  @IsString()
  body: string;
}
