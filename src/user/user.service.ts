import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: DatabaseService) {}

  create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...dto,
        profile: {
            create: {},
        },
    },
    select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        emailConfirmed: true,
        profile: true,
        updatedAt: true,
        createdAt: true,
    },
    })
    .catch(error => {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException("User with this argument already exists");
        }
      }
      return error
    });
  }

  findAll() {
    return this.prisma.user.findMany()
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({where: { id }})
  }

  update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({where: { id }, data: dto})
  }

  remove(id: string) {
    return this.prisma.user.delete({where: { id }})
  }
}
