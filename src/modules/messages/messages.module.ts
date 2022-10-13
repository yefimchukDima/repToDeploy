import { Module } from '@nestjs/common';
import MessagesController from './messages.controller';
import MessagesService from './messages.service';

@Module({
  imports: [],
  providers: [MessagesService],
  controllers: [MessagesController],
})
export default class MessagesModule {}
