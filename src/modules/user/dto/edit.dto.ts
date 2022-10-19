import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export default class EditUserDTO {
  @ApiProperty({
    example: 'a@a.com',
    nullable: true,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  mobile_number?: string;

  @ApiProperty({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiProperty({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isAdmin: boolean;
}
