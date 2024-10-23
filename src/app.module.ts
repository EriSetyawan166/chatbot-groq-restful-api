import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { ChatSessionModule } from './chat_session/chat-session.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [CommonModule, UserModule, ChatSessionModule, ChatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
