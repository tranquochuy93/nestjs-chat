import { IsNotEmpty, IsString } from 'class-validator';

export class RoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
