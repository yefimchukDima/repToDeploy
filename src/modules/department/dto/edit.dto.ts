import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export default class EditDepartmentDTO {
  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty()
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
}
