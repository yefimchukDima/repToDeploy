import { IsEmail, IsOptional, IsString } from 'class-validator';

export default class CreateUserDTO {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  mobile_number: string;

  @IsString()
  password: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;
}
