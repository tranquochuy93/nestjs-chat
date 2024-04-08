import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { AuthModule } from 'src/auth/auth.module';
import { MessageModule } from 'src/messages/message.module';

@Module({
  imports: [AuthModule, MessageModule],
  controllers: [],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class SocketModule {}
