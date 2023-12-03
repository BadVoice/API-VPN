import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { KeysService } from './keys.service';
import { KeysController } from './keys.controller';
import { DatabaseModule } from 'src/database/database.module';
import { WebhookService } from 'src/webhook.service';

@Module({
  controllers: [KeysController],
  providers: [KeysService, WebhookService],
  imports: [DatabaseModule]
})
export class KeysModule {}