import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateBy,
} from 'class-validator';

export default class EditUserDTO {
  @ApiProperty({
    example: 'a@a.com',
    nullable: true,
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, {
    message: 'Mobile number must have only numbers!',
  })
  @MinLength(6)
  mobile_number?: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  @ValidateBy({
    name: 'password_strength',
    validator: {
      validate: (value: string) => {
        if (!value.length || value.length < 6 || value.length > 50)
          return false;
        if (!value.match(/([!,%,&,@,#,$,^,*,?,_,~])/g)) return false;
        if (!value.match(/[a-z]/g)) return false;
        if (!value.match(/[A-Z]/g)) return false;
        if (!value.match(/[0-9]/g)) return false;

        return true;
      },
      defaultMessage: ({ value }) => {
        if (value.length < 6) return 'Too short!';
        if (value.length > 50) return 'Too long!';
        if (!value.match(/([!,%,&,@,#,$,^,*,?,_,~])/g))
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
  password?: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsString()
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
  @IsString()
  @IsOptional()
  base64_image?: string;
}
