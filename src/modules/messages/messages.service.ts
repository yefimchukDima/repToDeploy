import { Injectable, InternalServerErrorException } from '@nestjs/common';
import SendEmailDTO from './dto/send-email.dto';
import SendSMSDTO from './dto/send-sms.dto';
import { Twilio } from 'twilio';
import { MailService, MailDataRequired } from '@sendgrid/mail';

@Injectable()
export default class MessagesService {
  //TODO: Validate if it's necessary a queue

  private readonly twilio: Twilio;

  private readonly sendgrid: MailService;

  constructor() {
    const sid = process.env.TWILIO_SID; // Twilio Account SID
    const token = process.env.TWILIO_TOKEN; // Twilio Auth Token
    const sgApiKey = process.env.SENDGRID_API_KEY; // SendGrid API key
    const sendGrid = new MailService();

    sendGrid.setApiKey(sgApiKey);

    this.twilio = new Twilio(sid, token);
    this.sendgrid = sendGrid;
  }

  async sendEmail({ body, email, subject, ...params }: SendEmailDTO) {
    try {
      const from = process.env.SENDGRID_EMAIL; // Single sender config on sendgrid

      const template: MailDataRequired = {
        from,
        to: email,
        subject,
        text: body,
        ...params,
      };

      const message = await this.sendgrid.send(template);

      return message;
    } catch (error) {
      throw new InternalServerErrorException(
        'It was not possible to send E-mail: ' + error,
      );
    }
  }

  async sendSMS(data: SendSMSDTO) {
    try {
      const message = await this.twilio.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER, // Twilio Phone Number registered on Twilio console
        to: data.phone_number,
        body: data.message,
      });

      return message;
    } catch (error) {
      throw new InternalServerErrorException(
        'It was not possible to send SMS: ' + error,
      );
    }
  }
}
