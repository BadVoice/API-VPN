import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { KeysService } from 'src/keys/keys.service';
import { ProductService } from 'src/product/product.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, KeysService, ProductService],
  imports: [DatabaseModule],
  exports: [],
})
export class PaymentModule {}
