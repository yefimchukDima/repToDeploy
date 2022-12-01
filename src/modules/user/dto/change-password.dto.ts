import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export default class ChangePasswordDTO {
  @ApiProperty()
  @IsString()
  resetToken: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  // @ValidateBy({
  //   name: 'password_strength',
  //   validator: {
  //     validate: (value: string) => {
  //       if (!value.length || value.length < 6 || value.length > 50)
  //         return false;
  //       if (!value.match(/[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g)) return false;
  //       if (!value.match(/[a-z]/g)) return false;
  //       if (!value.match(/[A-Z]/g)) return false;
  //       if (!value.match(/[0-9]/g)) return false;

  //       return true;
  //     },
  //     defaultMessage: ({ value }) => {
  //       if (value.length < 6) return 'The password is too short!';
  //       if (value.length > 50) return 'The password is too long!';
  //       if (!value.match(/[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g))
  //         return 'The password must have a special character!';
  //       if (!value.match(/[a-z]/g))
  //         return 'The password must have a lower case letter!';
  //       if (!value.match(/[A-Z]/g))
  //         return 'The password must have an upper case letter!';
  //       if (!value.match(/[0-9]/g)) return 'The password must have a number!';

  //       return 'Invalid password!';
  //     },
  //   },
  // })
  newPassword: string;
}
