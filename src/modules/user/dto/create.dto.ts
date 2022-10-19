import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export default class CreateUserDTO {
  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  @IsEmail()
  email: string;

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

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

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
}
