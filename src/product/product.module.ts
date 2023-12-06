import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [DatabaseModule],
  exports: [ProductService]
})
export class ProductModule {}
