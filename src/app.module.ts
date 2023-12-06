import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { KeysModule } from './keys/keys.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AccessKeysModule } from './middleware/accessKeys.module';
import { TrackingService } from './middleware/get-vpn-keys.middleware';
import { KeysService } from './keys/keys.service';
import { PaymentModule } from './payment/payment.module';
import { PaymentService } from './payment/payment.service';
import { ProductModule } from './product/product.module';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    UserModule,
    AuthModule,
    KeysModule,
    PaymentModule,
    ProductModule
  ],
  
  controllers: [],
  providers: [TrackingService, KeysService, PaymentService],
})
export class AppModule {}
