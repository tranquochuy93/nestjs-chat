import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from 'src/messages/shemas/message.chema';
import { MessageDto } from '../http/dtos/message.dto';
import { AllMessagesDto } from '../http/dtos/all-messages.dto';
import { UserService } from 'src/users/services/user.service';

@Injectable()
export class MessageService {
  @InjectModel(Message.name) private messageModel: Model<MessageDocument>;

  constructor(private userService: UserService) {}

  async findAll({ from, to }: AllMessagesDto) {
    const messages = await this.messageModel
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ updatedAt: 1 });

    const projectedMessages = messages.map(({ text, author }) => {
      return {
        fromSelf: author.toString() === from,
        message: text,
      };
    });

    return projectedMessages;
  }

  async createOne({ message, from, to }: MessageDto) {
    const [author, receiver] = await Promise.all([
      this.userService.findOneById(from),
      this.userService.findOneById(to),
    ]);

    const createdMessage = new this.messageModel({
      text: message,
      author,
      receiver,
    });
    return createdMessage.save();
  }
}
