import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException, UseGuards } from '@nestjs/common';
import { KeysService } from './keys.service';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { WebhookService } from 'src/webhook.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('keys')
@UseGuards(RolesGuard)
export class KeysController {
  constructor(
    private readonly keysService: KeysService,
    private readonly webhookService: WebhookService
    ) {}

  @Get()
  findAll() {
    return this.keysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.keysService.findOne(id)
    .then(r => {
      if(!r) throw new NotFoundException('Key not found');
      return r
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.keysService.deleteKey(id);
      await this.webhookService.notifyKeyDeletion(id); 

      return 'Key deleted successfully and webhook notified';
    } catch (error) {
      console.error('Failed to delete key and notify webhook:', error);
      throw new BadRequestException('Key to delete does not exist');
    }
  }

  
}
