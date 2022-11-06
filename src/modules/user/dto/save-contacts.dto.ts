import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export default class SaveContactsDTO {
  @ApiProperty()
  @IsArray()
  contacts: string[];
}
