import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import JWTGuard from '../auth/guards/jwt.guard';
import SendEmailDTO from './dto/send-email.dto';
import SendSMSDTO from './dto/send-sms.dto';
import MessagesService from './messages.service';

@Controller('messages')
export default class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JWTGuard)
  @Post('send/email')
  async sendEmail(@Body() body: SendEmailDTO) {
    const email = await this.messagesService.sendEmail(body);

    return email;
  }

  @UseGuards(JWTGuard)
  @Post('send/sms')
  async sendSMS(@Body() body: SendSMSDTO) {
    const message = await this.messagesService.sendSMS(body);

    return message;
  }
}
