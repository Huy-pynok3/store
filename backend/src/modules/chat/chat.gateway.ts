import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  ForbiddenException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';

type AuthedSocket = Socket & { data: { userId?: string } };

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: AuthedSocket) {
    try {
      const token = this.extractToken(client);
      if (!token) {
        throw new UnauthorizedException('Missing token');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      client.data.userId = payload.sub;
      client.join(this.userRoom(payload.sub));
    } catch (error) {
      this.logger.warn(`Socket auth failed: ${error instanceof Error ? error.message : 'unknown error'}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: AuthedSocket) {
    this.logger.debug(`Socket disconnected: ${client.id}`);
  }

  @SubscribeMessage('chat:join')
  async handleJoinConversation(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() body: { conversationId: string },
  ) {
    const userId = this.getClientUserId(client);
    await this.chatService.ensureParticipant(userId, body.conversationId);
    client.join(this.conversationRoom(body.conversationId));
    return { success: true };
  }

  @SubscribeMessage('chat:leave')
  async handleLeaveConversation(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() body: { conversationId: string },
  ) {
    const userId = this.getClientUserId(client);
    await this.chatService.ensureParticipant(userId, body.conversationId);
    client.leave(this.conversationRoom(body.conversationId));
    return { success: true };
  }

  @SubscribeMessage('chat:send')
  async handleSendMessage(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() body: { conversationId: string; content: string },
  ) {
    const userId = this.getClientUserId(client);
    const message = await this.chatService.sendMessage(
      userId,
      body.conversationId,
      body.content,
    );

    this.server
      .to(this.conversationRoom(body.conversationId))
      .emit('chat:message:new', {
        conversationId: body.conversationId,
        message,
      });

    const participantIds = await this.chatService.getConversationParticipantIds(
      body.conversationId,
    );
    participantIds.forEach((participantId) => {
      this.server
        .to(this.userRoom(participantId))
        .emit('chat:conversation:refresh');
    });

    return { success: true, message };
  }

  @SubscribeMessage('chat:read')
  async handleReadConversation(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() body: { conversationId: string },
  ) {
    const userId = this.getClientUserId(client);
    await this.chatService.markConversationRead(userId, body.conversationId);

    this.server
      .to(this.conversationRoom(body.conversationId))
      .emit('chat:read', {
        conversationId: body.conversationId,
        userId,
      });

    return { success: true };
  }

  private extractToken(client: Socket) {
    const authToken = client.handshake.auth?.token;
    if (typeof authToken === 'string' && authToken.length > 0) {
      return authToken;
    }

    const headerToken = client.handshake.headers.authorization;
    if (typeof headerToken === 'string' && headerToken.startsWith('Bearer ')) {
      return headerToken.slice(7);
    }

    return null;
  }

  private getClientUserId(client: AuthedSocket) {
    const userId = client.data.userId;
    if (!userId) {
      throw new ForbiddenException('Unauthorized socket client');
    }

    return userId;
  }

  private userRoom(userId: string) {
    return `user:${userId}`;
  }

  private conversationRoom(conversationId: string) {
    return `conversation:${conversationId}`;
  }
}
