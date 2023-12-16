import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, MailService],
  imports: [DatabaseModule],
  exports: [ProductService]
})
export class ProductModule {}
