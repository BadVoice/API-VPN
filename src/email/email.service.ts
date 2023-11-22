import * as CryptoJS from 'crypto-js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  private secretKey = 'YourSecretKey';

  encryptEmail(email: string): string {
    return CryptoJS.AES.encrypt(email, this.secretKey).toString();
  }

  decryptEmail(encryptedEmail: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedEmail, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}