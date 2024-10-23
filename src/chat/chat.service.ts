import { Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { PrismaService } from '../common/prisma.service';
import { Sender, User } from '@prisma/client';
import { ChatResponse, CreateChatRequest } from '../model/chat.model';
import { WebResponse } from 'src/model/web.model';
import { chatValidation } from './chat.validation';
import { GroqService } from './groq.service';
import { ChatSessionService } from '../chat_session/chat-session.service';

@Injectable()
export class ChatService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private chatSessionService: ChatSessionService,
    private readonly groqService: GroqService,
  ) {}

  async create(
    user: User,
    request: CreateChatRequest,
  ): Promise<WebResponse<ChatResponse[]>> {
    const createChatRequest: CreateChatRequest =
      await this.validationService.validate(chatValidation.CREATE, request);
    await this.chatSessionService.checkChatSessionMustExists(
      createChatRequest.session_id,
      user.id,
    );
    const userChat = await this.prismaService.chat.create({
      data: {
        message: createChatRequest.message,
        sender: Sender.user,
        chatSession: {
          connect: { id: createChatRequest.session_id },
        },
      },
    });

    const aiResponse = await this.groqService.getChatCompletion(
      createChatRequest.message,
    );
    const aiChat = await this.prismaService.chat.create({
      data: {
        message: aiResponse.choices[0]?.message?.content || 'No AI response',
        sender: Sender.ai,
        chatSession: {
          connect: { id: createChatRequest.session_id },
        },
      },
    });

    return {
      data: [
        {
          id: userChat.id,
          sender: userChat.sender,
          message: userChat.message,
          created_at: userChat.created_at.toISOString(),
        },
        {
          id: aiChat.id,
          sender: aiChat.sender,
          message: aiChat.message,
          created_at: aiChat.created_at.toISOString(),
        },
      ],
    };
  }

  async get(
    user: User,
    chatSessionId: number,
  ): Promise<WebResponse<ChatResponse[]>> {
    const getRequest = await this.validationService.validate(
      chatValidation.GET,
      { session_id: chatSessionId },
    );
    await this.chatSessionService.checkChatSessionMustExists(
      getRequest.session_id,
      user.id,
    );
    const result = await this.prismaService.chat.findMany({
      where: {
        session_id: getRequest.session_id,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    return {
      data: result.map((chat) => ({
        id: chat.id,
        sender: chat.sender,
        message: chat.message,
        created_at: chat.created_at.toISOString(),
      })),
    };
  }
}
