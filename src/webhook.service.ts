import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const axios = require('axios').create({
  httpsAgent: new (require('https')).Agent({  
    rejectUnauthorized: false,
  }),
}); // for developer version, dont forgot remove this after deploy


@Injectable()
export class WebhookService {
  constructor(private readonly configService: ConfigService) {}
  async notifyKeyDeletion(id: string) {
    const removeKeysFromOutlineApi = this.configService.get('REMOVE_KEYS_OUTLINE_URL');
    const webhookResponse = await axios.delete(removeKeysFromOutlineApi + id);
    return webhookResponse.data
  }
}