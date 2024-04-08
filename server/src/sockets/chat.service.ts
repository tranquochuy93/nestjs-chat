import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { AuthService } from 'src/auth/services/auth.service';
import { MessageService } from 'src/messages/services/message.service';
import { MessageDto } from 'src/messages/http/dtos/message.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly authService: AuthService,
    private messageService: MessageService,
  ) {}

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const { Authentication: authenticationToken } = parse(cookie);
    const user = await this.authService.getUserFromAuthenticationToken(
      authenticationToken,
    );
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }

  saveMessage(dto: MessageDto) {
    return this.messageService.createOne(dto);
  }
}
