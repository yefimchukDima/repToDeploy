import { IsString } from 'class-validator';

export default class UserLoginDTO {
  @IsString()
  mobile_number: string;

  @IsString()
  password: string;
}
