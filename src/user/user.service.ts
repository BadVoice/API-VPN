import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { DatabaseService } from 'src/database/database.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: DatabaseService) {}
  
  async create(dto: CreateUserDto) {
    const hashedPassword = await this.hashedPassword(dto.password)
    return this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        profile: {
            create: {},
        },
    },
    select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
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
    .then(e => e.map(({ password, ...rest }) => rest))
    .catch((error) => console.error(error));
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        emailConfirmed: true,
        profile: true,
        updatedAt: true,
        createdAt: true,
      }})
  }

  update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({where: { id }, data: dto,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        emailConfirmed: true,
        profile: true,
        updatedAt: true,
        createdAt: true,
      }
    })
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        emailConfirmed: true,
        profile: true,
        updatedAt: true,
        createdAt: true,
      }
    })
  }

  private async hashedPassword(password: string): Promise<string>  {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword
  }
}
