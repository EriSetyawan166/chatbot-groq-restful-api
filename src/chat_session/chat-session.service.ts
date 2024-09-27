import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { User } from "@prisma/client";
import { ChatSessionResponse, CreateChatSessionRequest } from "../model/chat-session.model";
import { ValidationService } from "../common/validation.service";
import { ChatSessionValidation } from "./chat-session.validation";

@Injectable()
export class ChatSessionService {
    constructor(
        private prismaService: PrismaService,
        private validationService: ValidationService,
    ) { }

    async create(user: User, request: CreateChatSessionRequest): Promise<ChatSessionResponse> {
        const createChatSessionRequest: CreateChatSessionRequest = this.validationService.validate(ChatSessionValidation.CREATE, request);

        await this.prismaService.chatSession.updateMany({
            data: {
                is_active: false,
            }
        })

        const chatSession = await this.prismaService.chatSession.create({
            data: {
                title: createChatSessionRequest.title,
                user: {
                    connect: { id: user.id },
                },
            }
        })

        return {
            title: chatSession.title,
            is_active: chatSession.is_active,
            created_at: chatSession.created_at.toISOString(),
        }
    }
}