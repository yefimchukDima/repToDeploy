import { IsString } from 'class-validator';

export default class CompanyAdminLoginDTO {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
