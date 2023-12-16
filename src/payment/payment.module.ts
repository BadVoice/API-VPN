import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { KeysService } from 'src/keys/keys.service';
import { ProductService } from 'src/product/product.service';
import { PaymentsGateway } from './payment.gateway';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, KeysService, ProductService, PaymentsGateway, MailService],
  imports: [DatabaseModule],
  exports: [],
})
export class PaymentModule {}
