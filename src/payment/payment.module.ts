import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { KeysService } from 'src/keys/keys.service';
import { ProductService } from 'src/product/product.service';
import { PaymentsGateway } from './payment.gateway';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, KeysService, ProductService, PaymentsGateway],
  imports: [DatabaseModule],
  exports: [],
})
export class PaymentModule {}
