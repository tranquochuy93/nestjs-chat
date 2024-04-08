import { Module } from '@nestjs/common';
import { MessageController } from './http/controllers/message.controller';
import { MessageService } from './services/message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './shemas/message.chema';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    UserModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
