import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ChatSessionService } from "./chat-session.service";
import { Auth } from "../common/auth.decorator";
import { User } from "@prisma/client";
import { ChatSessionResponse, CreateChatSessionRequest } from "../model/chat-session.model";
import { WebResponse } from "../model/web.model";

@Controller('/api/chat-sessions')
export class ChatSessionController { 
    constructor(private chatSessionService: ChatSessionService) { }
    
    @Post()
    @HttpCode(200)
    async create(
        @Auth() user: User,
        @Body() request: CreateChatSessionRequest,
    ):Promise<WebResponse<ChatSessionResponse>> {
        const result = await this.chatSessionService.create(user, request);
        return {
            data: result,
        }
    }
}