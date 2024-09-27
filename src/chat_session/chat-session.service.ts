import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { User } from "@prisma/client";
import { ChatSessionResponse, CreateChatSessionRequest, ListChatSessionRequest } from "../model/chat-session.model";
import { ValidationService } from "../common/validation.service";
import { ChatSessionValidation } from "./chat-session.validation";
import { WebResponse } from "src/model/web.model";
import { Logger } from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

@Injectable()
export class ChatSessionService {
    constructor(
        private prismaService: PrismaService,
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
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

    async list(user: User, request: ListChatSessionRequest): Promise<WebResponse<ChatSessionResponse[]>> {
        this.logger.debug('Received ListChatSessionRequest', { request });

        const listChatSessionRequest: ListChatSessionRequest = this.validationService.validate(ChatSessionValidation.LIST, request);
        
        const chatSessions = await this.prismaService.chatSession.findMany({
            orderBy: {
                created_at: 'asc',
            },
            skip: listChatSessionRequest.offset,
            take: listChatSessionRequest.limit,
        })

        return {
            data: chatSessions.map(chatSession => ({
                title: chatSession.title,
                is_active: chatSession.is_active,
            })),
            paging: {
                offset: listChatSessionRequest.offset,
                limit: listChatSessionRequest.limit,
            }
        }
    }
}