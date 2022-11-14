import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import ChatMessageEntity from 'src/entities/chat_message.entity';
import UserEntity from 'src/entities/user.entity';
import { CREATING_REGISTER_ERROR } from 'src/utils/error-messages';
import { Repository } from 'typeorm';
import AuthService from '../auth/auth.service';

@Injectable()
export default class ChatService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(ChatMessageEntity)
    private readonly chatMessagesRepo: Repository<ChatMessageEntity>,
  ) {}

  async saveMessage(content: string, author: UserEntity, room: string) {
    const newMessage = new ChatMessageEntity();

    newMessage.author = author;
    newMessage.content = content;
    newMessage.room = room;

    try {
      const createdMessage = await this.chatMessagesRepo.save(newMessage);

      return createdMessage;
    } catch (e) {
      throw new InternalServerErrorException(
        CREATING_REGISTER_ERROR('message') + e,
      );
    }
  }

  async getAllMessagesByRoom(room: string) {
    const messages = await this.chatMessagesRepo.find({
      relations: {
        author: true,
      },
      where: {
        room,
      },
      select: {
        author: {
          id: true,
          first_name: true,
          last_name: true,
          base64_image: true,
          username: true,
        },
      },
      order: {
        date: 'DESC',
      },
    });

    return messages;
  }

  async validateUserFromToken(token: string) {
    const user = await this.authService.getUserFromToken(token);

    if (!user) {
      throw new WsException('Invalid credentials.');
    }

    return user;
  }
}
