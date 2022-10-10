import { IsEmail, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

export default class CreateDepartmentDTO {
  @IsOptional()
  @IsString()
  department?: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  phone_number: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsUrl()
  image_url?: string;

  @IsOptional()
  @IsString()
  button_text?: string;

  @IsOptional()
  @IsString()
  button_color?: string;

  @IsNumber()
  companyId: number;
}
