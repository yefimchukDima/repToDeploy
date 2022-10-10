import { IsEnum, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";
import { ButtonColor, ButtonEffects, ButtonType } from "src/entities/company.entity";

export default class CreateCompanyDTO {
  @IsString()
  mobile_number: string;

  @IsUrl()
  website_url: string;

  @IsString()
  name: string;

  @IsEnum(['call', 'text'], {
    message: `button_type must be one of these: ${['call', 'text'].join(', ')}`
  })
  button_type: ButtonType;

  @IsEnum(['red', 'orange'], {
    message: `button_color must be one of these: ${['red', 'orange'].join(', ')}`
  })
  @IsOptional()
  button_color?: ButtonColor;

  @IsOptional()
  @IsString()
  button_text?: string;

  @IsEnum(['hover', 'click'], {
    message: `button_effect must be one of these: ${['hover', 'click'].join(', ')}`
  })
  @IsOptional()
  button_effect?: ButtonEffects;

  @IsNumber()
  userId: number;
}
