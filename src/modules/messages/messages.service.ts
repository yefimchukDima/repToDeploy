import { Injectable } from '@nestjs/common';
import SendEmailDTO from './dto/send-email.dto';
import SendSMSDTO from './dto/send-sms.dto';

@Injectable()
export default class MessagesService {
  //TODO: Validate if it's necessary a queue

  async sendEmail(data: SendEmailDTO) {
    // Send email

    return;
  }

  async sendSMS(data: SendSMSDTO) {
    // Send SMS

    return;
  }
}
