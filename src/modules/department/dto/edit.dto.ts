import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export default class EditDepartmentDTO {
  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    nullable: true,
    required: false,
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
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    nullable: true,
    example: 'http://google.com',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  image_url?: string;
}
