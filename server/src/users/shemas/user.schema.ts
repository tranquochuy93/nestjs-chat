import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  userName: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop()
  isAvatarImageSet: boolean;

  @Prop()
  avatarImage: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
