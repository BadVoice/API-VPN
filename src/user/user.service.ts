import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { DatabaseService } from 'src/database/database.service';
import { EmailService } from 'src/email/email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly emailService: EmailService
    ) {}
  
  async create(dto: CreateUserDto) {
    const encryptedEmail = this.emailService.encryptEmail(dto.email);
    const hashedPassword = await this.hashedPassword(dto.password)
    return this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: encryptedEmail,
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
    .then(e => e.map(({ password, email, ...rest }) => rest))
    .catch((error) => console.error(error));
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        emailConfirmed: true,
        profile: true,
        updatedAt: true,
        createdAt: true,
      }})
  }

  update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({where: { id }, 
      data: dto,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        emailConfirmed: true,
        profile: true,
        updatedAt: true,
        createdAt: true,
      }
    })
  }

  async remove(userId: string) {

    await this.prisma.userProfile.delete({
      where: {
        id: userId
      }
    })

    return this.prisma.user.delete({
      where: {
        id: userId
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
    }).then(r => {
      if(!r) throw new NotFoundException('User not found');
      return r
    });
  }
  

  private async hashedPassword(password: string): Promise<string>  {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword
  }

  async getUserEmailById(userId: string){
   const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if (user) {
      const decryptedEmail = this.emailService.decryptEmail(user.email);
      return {decryptedEmail};
    }
    if(!user) throw new NotFoundException('User not found');
  }
}
