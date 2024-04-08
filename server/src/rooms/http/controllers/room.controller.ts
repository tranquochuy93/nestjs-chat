import { Controller, Get, Post } from '@nestjs/common';
import { RoomService } from '../../services/room.service';
import { RoomDto } from '../dtos/room.dto';

@Controller('rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Post()
  createOne(dto: RoomDto) {
    return this.roomService.createOne(dto);
  }
}
