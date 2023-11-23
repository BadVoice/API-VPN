import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { EmailModule } from 'src/email/email.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [DatabaseModule, EmailModule, ProfileModule],
  exports: [UserService],
})
export class UserModule {}
