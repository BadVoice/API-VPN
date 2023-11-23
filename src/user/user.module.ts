import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [DatabaseModule, EmailModule],
  exports: [UserService],
})
export class UserModule {}
