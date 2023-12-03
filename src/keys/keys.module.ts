import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { KeysService } from './keys.service';
import { KeysController } from './keys.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [KeysController],
  providers: [KeysService],
  imports: [DatabaseModule]
})
export class KeysModule {}