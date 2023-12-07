
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
export class GetVpnKeysTask {
    private readonly logger = new Logger(GetVpnKeysTask.name);
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
        await this.removeOldAccessKeys(processedData);
      } catch (error) {
        console.error('Error while requesting data:', error);
      }
    }

    async removeOldAccessKeys(newData: any[]) {
        const existingKeys = await this.accessKeysService.findAll();
        const existingIds = existingKeys.map(key => key.id);
        
        const keysToDelete = existingIds.filter(id => !newData.find(key => key.id === id));
        
        await Promise.all(keysToDelete.map(id => this.accessKeysService.deleteKey(id)));
      }
  
    @Cron(CronExpression.EVERY_SECOND)
    async handleCron() {
      this.logger.debug('Called every second');
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

  