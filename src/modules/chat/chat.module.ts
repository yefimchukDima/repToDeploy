import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ChatMessageEntity from 'src/entities/chat_message.entity';
import AuthModule from '../auth/auth.module';
import ChatGateway from './chat.gateway';
import ChatService from './chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessageEntity]), AuthModule],
  providers: [ChatService, ChatGateway],
})
export default class ChatModule {}
