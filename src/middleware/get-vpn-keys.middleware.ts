import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

const axios = require('axios').create({
    httpsAgent: new (require('https')).Agent({  
      rejectUnauthorized: false,
    }),
  }); // for developer version, dont forgot remove this after deploy

import { ConfigService } from '@nestjs/config';

@Injectable()
export class getVpnKeysMiddleware implements NestMiddleware {
    constructor(private configService: ConfigService) {}

    use(req: Request, res: Response, next: () => void) {
        const getKeysFromOutlineApi = this.configService.get('GET_KEYS_OUTLINE_URL');
        axios.get(getKeysFromOutlineApi)
        .then((response) => {
        const processedData = processData(response.data);
        res.locals.data = processedData;
        next();
    })
        .catch((error) => {
        console.error(error);
        next();
    });
    }
}

function processData(data: any) {
    if (!data.accessKeys || !Array.isArray(data.accessKeys)) {
        console.error('Data should have an array property accessKeys:', data);
        return [];
    }

    return data.accessKeys
}
