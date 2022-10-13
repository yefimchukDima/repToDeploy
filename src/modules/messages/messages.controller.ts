import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import JWTGuard from '../auth/guards/jwt.guard';
import SendEmailDTO from './dto/send-email.dto';
import SendSMSDTO from './dto/send-sms.dto';
import MessagesService from './messages.service';

@Controller('messages')
export default class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JWTGuard)
  @Post('send-email')
  async sendEmail(@Body() body: SendEmailDTO) {
    await this.messagesService.sendEmail(body);
  }

  @UseGuards(JWTGuard)
  @Post('send-sms')
  async sendSMS(@Body() body: SendSMSDTO) {
    await this.messagesService.sendSMS(body);
  }
}
