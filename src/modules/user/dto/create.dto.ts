import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateBy,
} from 'class-validator';

export default class CreateUserDTO {
  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsEmail(undefined, {
    message: 'Invalid email!'
  })
  email?: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString({
    message: 'Invalid username!',
  })
  username?: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString({
    message: 'Invalid phone number!',
  })
  @MinLength(6)
  mobile_number?: string;

  @ApiProperty()
  @IsString({
    message: 'Invalid password!',
  })
  @MinLength(6)
  @ValidateBy({
    name: 'password_strength',
    validator: {
      validate: (value: string) => {
        if (!value.length || value.length < 6 || value.length > 50)
          return false;
        if (!value.match(/[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g)) return false;
        if (!value.match(/[a-z]/g)) return false;
        if (!value.match(/[A-Z]/g)) return false;
        if (!value.match(/[0-9]/g)) return false;

        return true;
      },
      defaultMessage: ({ value }) => {
        if (value.length < 6) return 'The password is too short!';
        if (value.length > 50) return 'The password is too long!';
        if (!value.match(/[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g))
          return 'The password must have a special character!';
        if (!value.match(/[a-z]/g))
          return 'The password must have a lower case letter!';
        if (!value.match(/[A-Z]/g))
          return 'The password must have an upper case letter!';
        if (!value.match(/[0-9]/g)) return 'The password must have a number!';

        return 'Invalid password!';
      },
    },
  })
  password: string;

  @ApiProperty({
    nullable: true,
    required: false,
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
  @IsString({
    message: 'Invalid last name!',
  })
  @IsOptional()
  last_name?: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsString({
    message: 'Invalid image!',
  })
  @IsOptional()
  base64_image?: string;
}
