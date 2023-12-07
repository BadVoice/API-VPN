import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { KeysModule } from './keys/keys.module';
import { PaymentModule } from './payment/payment.module';
import { ProductModule } from './product/product.module';
import { ScheduleTaskModule } from './schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
    KeysModule,
    PaymentModule,
    ProductModule,
    ScheduleTaskModule
  ],
  
  controllers: [],
  providers: [],
})
export class AppModule {}
