import { Body, Controller, Post } from '@nestjs/common';
import SendEmailDTO from './dto/send-email.dto';
import SendSMSDTO from './dto/send-sms.dto';
import MessagesService from './messages.service';

@Controller('messages')
export default class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('send/email')
  async sendEmail(@Body() body: SendEmailDTO) {
    const email = await this.messagesService.sendEmail(body);

    return email;
  }

  @Post('send/sms')
  async sendSMS(@Body() body: SendSMSDTO) {
    const message = await this.messagesService.sendSMS(body);

    return message;
  }
}
