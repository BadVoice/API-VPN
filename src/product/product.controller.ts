import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
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
    return this.productService.findMany(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
