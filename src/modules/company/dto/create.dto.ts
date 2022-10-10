import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl } from 'class-validator';

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

  @ApiProperty()
  @IsNumber()
  userId: number;
}
