import { ApiProperty } from '@nestjs/swagger';

export default class UserHasEmailOrPasswordDTO {
  @ApiProperty()
  email: boolean;

  @ApiProperty()
  phone: boolean;
}
