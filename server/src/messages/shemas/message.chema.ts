import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { Document, ObjectId, Types, now } from 'mongoose';
import { User, UserSchema } from 'src/users/shemas/user.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  text: string;

  @Prop()
  roomId: string;

  // @Prop({ type: UserSchema })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  @Type(() => User)
  author: User;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  // @Prop({ type: UserSchema })
  @Type(() => User)
  receiver: User;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
