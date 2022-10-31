import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export default class ImportContactsDTO {
  @ApiProperty()
  @IsArray()
  contacts: string[];
}
