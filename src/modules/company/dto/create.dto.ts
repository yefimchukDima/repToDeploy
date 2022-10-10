import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import {
  ButtonColor,
  ButtonEffects,
  ButtonType,
} from 'src/entities/company.entity';

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
    enum: ['call', 'text'],
  })
  @IsEnum(['call', 'text'], {
    message: `button_type must be one of these: ${['call', 'text'].join(', ')}`,
  })
  button_type: ButtonType;

  @ApiProperty({
    enum: ['red', 'orange'],
    nullable: true,
  })
  @IsEnum(['red', 'orange'], {
    message: `button_color must be one of these: ${['red', 'orange'].join(
      ', ',
    )}`,
  })
  @IsOptional()
  button_color?: ButtonColor;

  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  button_text?: string;

  @ApiProperty({
    enum: ['hover', 'click'],
    nullable: true,
  })
  @IsEnum(['hover', 'click'], {
    message: `button_effect must be one of these: ${['hover', 'click'].join(
      ', ',
    )}`,
  })
  @IsOptional()
  button_effect?: ButtonEffects;

  @ApiProperty()
  @IsNumber()
  userId: number;
}
