import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export default class EditUserDTO {
  @ApiProperty({
    example: 'a@a.com',
    nullable: true,
    required: false,
  })
  @IsEmail(undefined, {
    message: 'Invalid email!',
  })
  @IsNotEmpty({
    message: 'E-mail must not be empty!',
  })
  @IsOptional()
  email?: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({
    message: 'Username must not be empty!',
  })
  @IsString({
    message: 'Invalid username!',
  })
  username?: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({
    message: 'Mobile number must not be empty!',
  })
  @IsString({
    message: 'Invalid phone number!',
  })
  @MinLength(6)
  mobile_number?: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsNotEmpty({
    message: 'Password must not be empty!',
  })
  @IsString({
    message: 'Invalid password!',
  })
  @IsOptional()
  // @ValidateBy({
  //   name: 'password_strength',
  //   validator: {
  //     validate: (value: string) => {
  //       if (!value.length || value.length < 6 || value.length > 50)
  //         return false;
  //       if (
  //         !value.match(
  //           /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g,
  //         )
  //       )
  //         return false;
  //       if (!value.match(/[a-z]/g)) return false;
  //       if (!value.match(/[A-Z]/g)) return false;
  //       if (!value.match(/[0-9]/g)) return false;

  //       return true;
  //     },
  //     defaultMessage: ({ value }) => {
  //       if (value.length < 6) return 'Too short!';
  //       if (value.length > 50) return 'Too long!';
  //       if (
  //         !value.match(
  //           /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g,
  //         )
  //       )
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
  password?: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsNotEmpty({
    message: 'First name must not be empty!',
  })
  @IsString({
    message: 'Invalid first name!',
  })
  @IsOptional()
  first_name?: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsNotEmpty({
    message: 'Last name not be empty!',
  })
  @IsString({
    message: 'Invalid last name!',
  })
  @IsOptional()
  last_name?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isAdmin: boolean;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsNotEmpty({
    message: 'Image must not be empty!',
  })
  @IsString({
    message: 'Invalid image!',
  })
  @IsOptional()
  base64_image?: string;
}
