import {
  Body,
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Post,
  Query,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ChatSessionService } from './chat-session.service';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';
import {
  ChatSessionResponse,
  CreateChatSessionRequest,
  ListChatSessionRequest,
  UpdateChatSessionRequest,
} from '../model/chat-session.model';
import { WebResponse } from '../model/web.model';

@Controller('/api/chat-sessions')
export class ChatSessionController {
  constructor(private chatSessionService: ChatSessionService) {}

  @Post()
  @HttpCode(200)
  async create(
    @Auth() user: User,
    @Body() request: CreateChatSessionRequest,
  ): Promise<WebResponse<ChatSessionResponse>> {
    const result = await this.chatSessionService.create(user, request);
    return {
      data: result,
    };
  }

  @Get()
  @HttpCode(200)
  async list(
    @Auth() user: User,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<WebResponse<ChatSessionResponse[]>> {
    const request: ListChatSessionRequest = {
      offset: offset || 0,
      limit: limit || 10,
    };
    const result = await this.chatSessionService.list(user, request);
    return result;
  }

  @Put('/:chatSessionId')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('chatSessionId', ParseIntPipe) chatSessionId: number,
    @Body() request: UpdateChatSessionRequest,
  ): Promise<WebResponse<ChatSessionResponse>> {
    request.id = chatSessionId;
    const result = await this.chatSessionService.update(user, request);
    return {
      data: result,
    };
  }

  @Delete('/:chatSessionId')
  @HttpCode(200)
  async remove(
    @Auth() user: User,
    @Param('chatSessionId', ParseIntPipe) chatSessionId: number,
  ): Promise<WebResponse<boolean>> {
    await this.chatSessionService.remove(user, chatSessionId);
    return {
      data: true,
    };
  }
}
