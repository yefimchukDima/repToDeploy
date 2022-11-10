import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class SaveMessageDTO {
  @IsNumber()
  authorId: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  room: string;
}
