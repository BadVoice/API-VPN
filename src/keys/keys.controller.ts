import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KeysService } from './keys.service';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';

@Controller('keys')
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @Get()
  findAll() {
    return this.keysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.keysService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKeyDto: UpdateKeyDto) {
    return this.keysService.update(+id, updateKeyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.keysService.remove(+id);
  }
}
