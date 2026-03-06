import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConversationType } from '@prisma/client';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class ChatService {
  private readonly supportAdminUsername = 'taphoammo';

  constructor(private prisma: PrismaService) {}

  async listConversations(userId: string) {
    await this.ensureSupportConversation(userId);

    const participantRows = await this.prisma.conversationParticipant.findMany({
      where: { userId },
      orderBy: { conversation: { updatedAt: 'desc' } },
      include: {
        conversation: {
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    fullName: true,
                    role: true,
                  },
                },
              },
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              include: {
                sender: {
                  select: {
                    id: true,
                    username: true,
                    fullName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return Promise.all(
      participantRows.map(async (participant) => {
        const latestMessage = participant.conversation.messages[0] ?? null;
        const otherParticipants = participant.conversation.participants
          .filter((item) => item.userId !== userId)
          .map((item) => item.user);
        const displayUser = otherParticipants[0] ?? null;

        const unreadCount = await this.prisma.chatMessage.count({
          where: {
            conversationId: participant.conversation.id,
            senderId: { not: userId },
            ...(participant.lastReadAt
              ? { createdAt: { gt: participant.lastReadAt } }
              : {}),
          },
        });

        return {
          id: participant.conversation.id,
          type: participant.conversation.type,
          title:
            participant.conversation.title ??
            (displayUser?.role === 'ADMIN' ? displayUser.username : displayUser?.fullName) ??
            displayUser?.username ??
            'Cuoc tro chuyen',
          updatedAt: participant.conversation.updatedAt,
          unreadCount,
          otherParticipant: displayUser,
          latestMessage: latestMessage
            ? {
                id: latestMessage.id,
                content: latestMessage.content,
                createdAt: latestMessage.createdAt,
                senderId: latestMessage.senderId,
                senderName:
                  latestMessage.sender.fullName ??
                  latestMessage.sender.username,
              }
            : null,
        };
      }),
    );
  }

  async getConversationMessages(userId: string, conversationId: string) {
    await this.assertParticipant(conversationId, userId);

    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                role: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                fullName: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return {
      id: conversation.id,
      type: conversation.type,
      title: conversation.title,
      participants: conversation.participants.map((participant) => ({
        id: participant.user.id,
        username: participant.user.username,
        fullName: participant.user.fullName,
        role: participant.user.role,
      })),
      messages: conversation.messages.map((message) => ({
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        sender: {
          id: message.sender.id,
          username: message.sender.username,
          fullName: message.sender.fullName,
        },
      })),
    };
  }

  async createDirectConversation(userId: string, participantId: string) {
    if (userId === participantId) {
      throw new BadRequestException('Cannot create a conversation with yourself');
    }

    const participantUser = await this.prisma.user.findUnique({
      where: { id: participantId },
      select: { id: true },
    });

    if (!participantUser) {
      throw new NotFoundException('Participant not found');
    }

    const existingConversation = await this.prisma.conversation.findMany({
      where: {
        type: ConversationType.DIRECT,
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: true,
      },
    });

    const matched = existingConversation.find((conversation) => {
      const participantIds = conversation.participants.map((item) => item.userId);
      return (
        participantIds.length === 2 &&
        participantIds.includes(userId) &&
        participantIds.includes(participantId)
      );
    });

    if (matched) {
      return { id: matched.id };
    }

    const conversation = await this.prisma.conversation.create({
      data: {
        type: ConversationType.DIRECT,
        participants: {
          create: [{ userId }, { userId: participantId }],
        },
      },
      select: { id: true },
    });

    return conversation;
  }

  async sendMessage(userId: string, conversationId: string, content: string) {
    await this.assertParticipant(conversationId, userId);

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      throw new BadRequestException('Message content is required');
    }

    const message = await this.prisma.$transaction(async (tx) => {
      const createdMessage = await tx.chatMessage.create({
        data: {
          conversationId,
          senderId: userId,
          content: trimmedContent,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              fullName: true,
            },
          },
        },
      });

      await tx.conversation.update({
        where: { id: conversationId },
        data: {
          updatedAt: createdMessage.createdAt,
        },
      });

      await tx.conversationParticipant.updateMany({
        where: {
          conversationId,
          userId,
        },
        data: {
          lastReadAt: createdMessage.createdAt,
        },
      });

      return createdMessage;
    });

    return {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      sender: {
        id: message.sender.id,
        username: message.sender.username,
        fullName: message.sender.fullName,
      },
    };
  }

  async markConversationRead(userId: string, conversationId: string) {
    await this.assertParticipant(conversationId, userId);

    await this.prisma.conversationParticipant.updateMany({
      where: {
        conversationId,
        userId,
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    return { success: true };
  }

  private async ensureSupportConversation(userId: string) {
    const adminUser = await this.prisma.user.findFirst({
      where: {
        username: this.supportAdminUsername,
        role: 'ADMIN',
        isActive: true,
      },
      select: { id: true },
    });

    if (!adminUser || adminUser.id === userId) {
      return;
    }

    const conversation = await this.createDirectConversation(userId, adminUser.id);
    await this.ensureSupportConversationMessages(conversation.id, adminUser.id);
  }

  private async ensureSupportConversationMessages(
    conversationId: string,
    adminUserId: string,
  ) {
    const existingCount = await this.prisma.chatMessage.count({
      where: { conversationId },
    });

    if (existingCount > 0) {
      return;
    }

    const initialMessages = [
      'Xin hay canh giac voi giao dich khong duoc bao hiem ben ngoai san.',
      'Chao ban, day la ho tro admin taphoammo. Neu can ho tro don hang, hay gui ma don va noi dung can xu ly.',
    ];

    await this.prisma.$transaction(async (tx) => {
      const createdAt = new Date();

      for (const content of initialMessages) {
        await tx.chatMessage.create({
          data: {
            conversationId,
            senderId: adminUserId,
            content,
            createdAt,
          },
        });
      }

      await tx.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: createdAt },
      });
    });
  }

  async ensureParticipant(userId: string, conversationId: string) {
    await this.assertParticipant(conversationId, userId);
  }

  async getConversationParticipantIds(conversationId: string) {
    const participants = await this.prisma.conversationParticipant.findMany({
      where: { conversationId },
      select: { userId: true },
    });

    return participants.map((participant) => participant.userId);
  }

  private async assertParticipant(conversationId: string, userId: string) {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
      select: { id: true },
    });

    if (!participant) {
      throw new NotFoundException('Conversation not found');
    }
  }
}
