import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {

  constructor(private configService: ConfigService) {}

  private async sendMail(recipient: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: Number(this.configService.get<string>('MAIL_PORT')),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'), 
      },
    });

    await transporter.sendMail({
      from: '"Your Company" <from@example.com>', // sender address
      to: recipient, 
      subject: subject, 
      text: text, 
    });
  }

  public async sendUserCredential(recipient: string, password: string) {
    const subject = 'Привет, твой аккаунт был создан';
    const text = `Для входа в ваш личный кабинет для управления подпиской, вы можете использовать, Email: ${recipient}, Password: ${password}`;

    await this.sendMail(recipient, subject, text);
  }

  public async sendProductInfo(recipient: string, accessUrl: string, region: string) {
    const subject = 'Привет, твой продукт был создан';
    const text = `
      Поздравляем! Ваши данные:
      Access Url: ${accessUrl}
      Region: ${region}`;
  
    await this.sendMail(recipient, subject, text);
  }

  public async sendDeleteProductInfo(recipient: string, accessUrl: string) {
    const subject = 'Здравствуйте, время вашего ключа закончилось';
    const text = `
      Ваш ключ был удален:
      Access Url: ${accessUrl}
      `
    await this.sendMail(recipient, subject, text);
  }
}
