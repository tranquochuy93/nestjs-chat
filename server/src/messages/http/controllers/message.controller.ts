import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { MessageService } from '../../services/message.service';
import { MessageDto } from '../dtos/message.dto';
import { AllMessagesDto } from '../dtos/all-messages.dto';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get()
  findAll(@Query() dto: AllMessagesDto) {
    return this.messageService.findAll(dto);
  }

  @Post()
  createOne(@Body() dto: MessageDto) {
    return this.messageService.createOne(dto);
  }
}
