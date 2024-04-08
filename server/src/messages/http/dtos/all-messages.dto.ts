import { IsNotEmpty, IsString } from 'class-validator';

export class AllMessagesDto {
  @IsString()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  from: string;
}
