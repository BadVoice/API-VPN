import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('products')
@UseGuards(AuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() dto: CreateProductDto) {
    return await this.productService.createProductForUser(dto);
  }


  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findMany(@Param('id') id: string) {
    return this.productService.findMany(id)
    .then(r => {
      if(!r) throw new NotFoundException('Produtct with this userId not found');
      return r
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id)
    .then(r => {
      if(!r) throw new NotFoundException('User not found');
      return r
    });
  }
}
