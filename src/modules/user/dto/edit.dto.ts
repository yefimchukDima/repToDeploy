import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export default class EditUserDTO {
  @ApiProperty({
    example: 'a@a.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  mobile_number?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isAdmin: boolean;
}
