import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UserDto } from '../http/dtos/user.dto';
import { User, UserDocument } from '../shemas/user.schema';

@Injectable()
export class UserService {
  @InjectModel(User.name) private userModel: Model<UserDocument>;

  findAll() {
    return this.userModel.find();
  }

  createOne(dto: UserDto) {
    const createdPost = new this.userModel(dto);
    return createdPost.save();
  }

  findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  findOneById(id: string) {
    const _id = new mongoose.Types.ObjectId(id);
    return this.userModel.findById(_id);
  }

  async setAvatar(avatarImage: string, id): Promise<User> {
    const _id = new mongoose.Types.ObjectId(id);
    const post = await this.userModel
      .findByIdAndUpdate(_id, { isAvatarImageSet: true, avatarImage })
      .setOptions({ new: true });

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }
}
