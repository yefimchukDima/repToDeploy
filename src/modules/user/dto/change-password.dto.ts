import { IsString } from 'class-validator';

export default class ChangePasswordDTO {
  @IsString()
  resetToken: string;

  @IsString()
  newPassword: string;
}
