import { Injectable } from '@nestjs/common';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class KeysService {
  constructor(
    private readonly prisma: DatabaseService,
  ) {}

  async create(data) {
    const existingIds = (await this.prisma.accessKey.findMany()).map(k => k.accessUrl);

    // Фильтровать входные данные на наличие несуществующих ID
    const newKeys = data.filter(key => !existingIds.includes(key.accessUrl));
    return this.prisma.accessKey.createMany({ data: newKeys });
  }

  findAll() {
    return this.prisma.accessKey.findMany()
  }

  findOne(id: number) {
    return `This action returns a #${id} key`;
  }

  update(id: number, updateKeyDto: UpdateKeyDto) {
    return `This action updates a #${id} key`;
  }

  remove(id: number) {
    return `This action removes a #${id} key`;
  }
}