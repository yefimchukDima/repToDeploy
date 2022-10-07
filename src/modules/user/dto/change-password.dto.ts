import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class ChangePasswordDTO {
  @ApiProperty()
  @IsString()
  resetToken: string;

  @ApiProperty()
  @IsString()
  newPassword: string;
}
