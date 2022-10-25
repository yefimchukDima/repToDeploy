import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export default class SendEmailDTO {
  @ApiProperty({
    example: 'email@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  subject: string;

  @ApiProperty({
    nullable: true
  })
  @IsString()
  @IsOptional()
  html?: string;

  @ApiProperty({
    examples: ['example', '{key: value}'],
  })
  @IsString()
  body: string;
}
