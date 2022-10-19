import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export default class CreateDepartmentDTO {
  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsString()
  phone_number: string;

  @ApiProperty({
    example: 'a@a.com',
    nullable: true,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    nullable: true,
    example: 'http://google.com',
  })
  @IsOptional()
  @IsUrl()
  image_url?: string;

  @ApiProperty()
  @IsNumber()
  companyId: number;
}
