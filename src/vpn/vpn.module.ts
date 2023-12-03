import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { VpnService } from './vpn.service';
import { VpnController } from './vpn.controller';
import { getVpnKeysMiddleware } from 'src/middleware/get-vpn-keys.middleware';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [VpnController],
  providers: [VpnService, getVpnKeysMiddleware],
  imports: [DatabaseModule]
})
export class VpnModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(getVpnKeysMiddleware)
      .forRoutes(VpnController);
  }
}
