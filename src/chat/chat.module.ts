import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { GroqService } from "./groq.service";
import { ChatSessionModule } from "../chat_session/chat-session.module";

@Module({
    imports: [ChatSessionModule],
    providers: [ChatService, GroqService],
    controllers: [ChatController],
})
export class ChatModule {}