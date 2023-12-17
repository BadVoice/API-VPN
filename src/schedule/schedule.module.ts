import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { GetVpnKeysTask } from './tasks/get-vpn-keys.task';
import { DatabaseModule } from 'src/database/database.module';
import { KeysService } from 'src/keys/keys.service';
import { RemoveVpnKeysTask } from './tasks/remove-vpn-keys.task';
import { WebhookService } from 'src/webhook.service';
import { MailService } from 'src/mail/mail.service';
  

@Module({
    imports: [
        ScheduleModule.forRoot(),
        DatabaseModule
    ],
    providers: [GetVpnKeysTask, KeysService, RemoveVpnKeysTask, WebhookService, MailService],
})
export class ScheduleTaskModule {}