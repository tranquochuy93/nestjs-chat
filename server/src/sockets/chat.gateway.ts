import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { MessageDto } from 'src/messages/http/dtos/message.dto';

@WebSocketGateway({ cors: true })
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    stopAtFirstError: true,
  }),
)
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() dto: MessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    // const author = await this.chatService.getUserFromSocket(socket);
    console.log(dto);
    // const message = await this.chatService.saveMessage(dto);

    this.server.sockets.emit('receive_message', { text: dto.message });
  }
}
