import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { ChatSessionModule } from './chat_session/chat-session.module';

@Module({
  imports: [CommonModule, UserModule, ChatSessionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
