import { IsEmail, IsString } from 'class-validator';

export default class CreateCompanyAdminDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;
}
