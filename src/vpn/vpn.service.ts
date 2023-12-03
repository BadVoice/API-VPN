import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class VpnService {
    constructor(
        private readonly prisma: DatabaseService,
     ) {}
}
