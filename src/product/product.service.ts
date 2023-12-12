import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseService } from 'src/database/database.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: DatabaseService) {}

  async createProductForUser(dto: CreateProductDto) {
    const { userId, name, accessUrl,  region } = dto;
    
    return this.prisma.product.create({
      data: {
        name,
        accessUrl,
        region,
        user: {
          connect: { id: userId },
        },
      },
      select: {
        name: true,
        accessUrl: true,
        region: true,
        id: true,
        createdAt: true,
        updatedAt: true
      }
    })
    .catch(error => {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException("User with this id already exists");
        }
      }
      return error
    });
  }

  findAll() {
    return this.prisma.product.findMany()
  }

  findMany(id: string) {
    return this.prisma.product.findMany({ where: { userId: id } })
  }

  remove(id: string) {
    return this.prisma.product.delete({ where: { id } })
  }
}
