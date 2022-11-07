import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class SaveContactsDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  last_name?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  avatar?: string;
}
