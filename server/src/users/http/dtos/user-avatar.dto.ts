import { IsNotEmpty, IsString } from 'class-validator';

export class UserAvatarDto {
  @IsString()
  @IsNotEmpty()
  image: string;
}
