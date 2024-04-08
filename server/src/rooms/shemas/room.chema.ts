import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/users/shemas/user.schema';

export type RoomDocument = Room & Document;

@Schema()
export class Room {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop()
  name: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }],
  })
  @Type(() => User)
  Users: User;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
