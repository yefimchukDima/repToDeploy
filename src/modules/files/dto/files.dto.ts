import { ApiProperty } from '@nestjs/swagger';

export default class FilesDTO {
  @ApiProperty({
    example: 'file.png'
  })
  name: string;

  @ApiProperty({
    example: 'https://bucket.s3.amazonaws.com/file.png'
  })
  location: string;
}
