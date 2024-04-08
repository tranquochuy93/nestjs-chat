import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from '../shemas/room.chema';
import { RoomDto } from '../http/dtos/room.dto';

@Injectable()
export class RoomService {
  @InjectModel(Room.name) private roomModel: Model<RoomDocument>;

  findAll() {
    return this.roomModel.find();
  }

  createOne(dto: RoomDto) {
    const createdRoom = new this.roomModel(dto);
    return createdRoom.save();
  }
}
