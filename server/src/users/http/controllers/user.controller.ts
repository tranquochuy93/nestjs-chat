import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../../services/user.service';
import { UserDto } from '../dtos/user.dto';
import { UserAvatarDto } from '../dtos/user-avatar.dto';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param() id: string) {
    return this.userService.findOneById(id);
  }

  @Post()
  createOne(dto: UserDto) {
    return this.userService.createOne(dto);
  }

  @Post('set-avatar/:id')
  setAvatar(
    @Res() request,
    @Param() id: string,
    @Body() { image }: UserAvatarDto,
  ) {
    return this.userService.setAvatar(image, id);
  }
}
