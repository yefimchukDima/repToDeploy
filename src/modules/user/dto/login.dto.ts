import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export default class UserLoginDTO {
  @ApiProperty()
  @IsNotEmpty({
    message: 'Login must not be empty!',
  })
  @IsString({
    message: 'Invalid login!',
  })
  login: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Password must not be empty!',
  })
  @IsString({
    message: 'Invalid password!',
  })
  @MinLength(6)
  password: string;
}
