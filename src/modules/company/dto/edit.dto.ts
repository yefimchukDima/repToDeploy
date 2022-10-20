import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export default class EditCompanyDTO {
  @ApiProperty()
  @IsString()
  mobile_number: string;

  @ApiProperty({
    example: 'http://google.com',
  })
  @IsUrl()
  website_url: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  keywords?: string[];

  @ApiProperty()
  @IsString()
  name: string;
}
