
const axios = require('axios').create({
    httpsAgent: new (require('https')).Agent({  
      rejectUnauthorized: false,
    }),
  }); // for developer version, dont forgot remove this after deploy

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { KeysService } from 'src/keys/keys.service';

@Injectable()
export class TrackingService {
    private readonly logger = new Logger(TrackingService.name);
    constructor(
        private accessKeysService: KeysService,
        private configService: ConfigService) 
    {}

    async getAccessKeys() {
      try {
        const getKeysFromOutlineApi = this.configService.get('GET_KEYS_OUTLINE_URL');
        const response = await axios.get(getKeysFromOutlineApi);
        const processedData = processData(response.data);
        const accessKeyDto = processedData
  
        await this.accessKeysService.create(accessKeyDto);
      } catch (error) {
        console.error('Error while requesting data:', error);
      }
    }
  
    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron() {
      this.logger.debug('Called every minute');
      await this.getAccessKeys();
    }
  }
  
  function processData(data: any) {
    if (!data.accessKeys || !Array.isArray(data.accessKeys)) {
      console.error('Data should have an array property accessKeys:', data);
      return [];
    }
    return data.accessKeys;
  }
  