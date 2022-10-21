import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export default class CreateCompanyDTO {
  @ApiProperty()
  @IsString()
  mobile_number: string;

  @ApiProperty({
    example: 'http://google.com',
  })
  @IsUrl()
  website_url: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  keywords?: string[];

  @ApiProperty()
  @IsNumber()
  userId: number;
}
