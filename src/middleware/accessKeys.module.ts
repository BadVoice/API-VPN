import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { KeysService } from "src/keys/keys.service";

@Module({
    controllers: [],
    providers: [KeysService],
    imports: [DatabaseModule]
  })
  export class AccessKeysModule {}