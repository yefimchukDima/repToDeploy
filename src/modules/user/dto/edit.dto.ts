import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export default class EditUserDTO {
  @ApiProperty({
    example: 'a@a.com',
    nullable: true,
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  mobile_number?: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isAdmin: boolean;

  @ApiProperty({
    nullable: true,
    required: false
  })
  @IsString()
  @IsOptional()
  base64_image?: string;
}
