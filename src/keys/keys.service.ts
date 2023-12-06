import { Injectable } from '@nestjs/common';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class KeysService {
  constructor(
    private readonly prisma: DatabaseService
  ) {}

  async create(data) {
    const existingIds = (await this.prisma.accessKey.findMany()).map(k => k.accessUrl);
    const newKeys = data.filter(key => !existingIds.includes(key.accessUrl));
    return this.prisma.accessKey.createMany({ data: newKeys });
  }

  findAll() {
    return this.prisma.accessKey.findMany()
  }

  findOne(id: string) {
    return this.prisma.accessKey.findUnique({
      where: {
        id
      }
    })
  }

  async deleteKey(id: string) {
    await this.prisma.accessKey.delete({
      where: { id: id }
    });
  }
}