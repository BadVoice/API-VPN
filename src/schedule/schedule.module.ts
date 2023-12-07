import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { GetVpnKeysTask } from './tasks/get-vpn-keys.task';
import { DatabaseModule } from 'src/database/database.module';
import { KeysService } from 'src/keys/keys.service';
  

@Module({
    imports: [
        ScheduleModule.forRoot(),
        DatabaseModule
    ],
    providers: [GetVpnKeysTask, KeysService],
})
export class ScheduleTaskModule {}