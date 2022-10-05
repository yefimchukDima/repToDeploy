import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export default class EditUserDTO {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  mobile_number?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsBoolean()
  isAdmin: boolean;
}
