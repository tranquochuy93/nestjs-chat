import { Module } from '@nestjs/common';
import { RoomController } from './http/controllers/room.controller';
import { RoomService } from './services/room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './shemas/room.chema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
  ],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
