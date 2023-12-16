import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class KeysService {
  constructor(
    private readonly prisma: DatabaseService
  ) {}

  async create(data) {
    const existingIds = (await this.prisma.accessKey.findMany()).map(k => k.id);
    const newKeys = data.filter(key => !existingIds.includes(key.id));
    return this.prisma.accessKey.createMany({ data: newKeys });
  }

  findAll() {
    return this.prisma.accessKey.findMany({
      select: {
        id: true,
        modelId: true,
        usedAt: true
      }
    })
  }

  findOne(id: string) {
    return this.prisma.accessKey.findUnique({
      where: {
        modelId: id
      },
      select: {
        id: true,
        modelId: true,
        accessUrl: true
      }
    })
  }

  async deleteKey(id: string) {
    await this.prisma.accessKey.delete({
      where: { id: id },
      select: {
        id: true,
        modelId: true
      }
    }).then(r => {
      if(!r) throw new NotFoundException('Key not found');
      return r
    });
  }
}