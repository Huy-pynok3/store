import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  listConversations(@Request() req) {
    return this.chatService.listConversations(req.user.userId);
  }

  @Post('conversations')
  createConversation(@Request() req, @Body() body: CreateConversationDto) {
    return this.chatService.createDirectConversation(
      req.user.userId,
      body.participantId,
    );
  }

  @Get('conversations/:conversationId/messages')
  getMessages(@Request() req, @Param('conversationId') conversationId: string) {
    return this.chatService.getConversationMessages(
      req.user.userId,
      conversationId,
    );
  }

  @Post('conversations/:conversationId/messages')
  sendMessage(
    @Request() req,
    @Param('conversationId') conversationId: string,
    @Body() body: SendMessageDto,
  ) {
    return this.chatService.sendMessage(
      req.user.userId,
      conversationId,
      body.content,
    );
  }

  @Post('conversations/:conversationId/read')
  markRead(@Request() req, @Param('conversationId') conversationId: string) {
    return this.chatService.markConversationRead(req.user.userId, conversationId);
  }
}
