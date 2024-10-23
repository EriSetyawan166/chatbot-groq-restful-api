import { Body, Controller, HttpCode, Param, Post, ParseIntPipe } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatResponse, CreateChatRequest } from "../model/chat.model";
import { WebResponse } from "src/model/web.model";
import { Auth } from "../common/auth.decorator";
import { User } from "@prisma/client";
@Controller('/api/chat-sessions/:chatSessionId/chat')
export class ChatController {
    constructor(private chatService: ChatService) { }
    
    @Post()
    @HttpCode(200)
    async create(
        @Auth() user: User,
        @Param('chatSessionId', ParseIntPipe) chatSessionId: number,
        @Body() request: CreateChatRequest,
    ): Promise<WebResponse<ChatResponse[]>> {
        request.session_id = chatSessionId;
        const result = await this.chatService.create(user, request);
        return result
    }
}