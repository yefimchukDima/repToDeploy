import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export default class SaveContactsDTO {
  @ApiProperty()
  @IsNotEmpty({
    message: 'First name must not be empty!',
  })
  @IsString({
    message: 'Invalid first name!',
  })
  first_name: string;

  @ApiProperty({
    required: false,
  })
  @IsString({
    message: 'Invalid last name!',
  })
  @IsNotEmpty({
    message: 'Last name must not be empty!',
  })
  @IsOptional()
  last_name?: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Phone must not be empty!',
  })
  @Matches(/^\d+$/, {
    message: 'Phone number must have only numbers!',
  })
  @IsString({
    message: 'Invalid phone!',
  })
  phone: string;

  @ApiProperty({
    required: false,
  })
  @IsString({
    message: 'Invalid avatar image!',
  })
  @IsNotEmpty({
    message: 'Avatar image must not be empty!',
  })
  @IsOptional()
  avatar?: string;
}
