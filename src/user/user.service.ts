import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { DatabaseService } from 'src/database/database.service';
import { EmailService } from 'src/email/email.service';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly emailService: EmailService
    ) {}

    async login(email: string, pass: string) {
      const user = await this.prisma.user.findUnique({
        where: {
          email
        }
      })
  
      if(!user) return null
  
      const isPasswordValid = await bcrypt.compare(pass, user.password);
  
      if(isPasswordValid) {
        return user
      } else {
        return null
      }
    }

    private generatePassword(length: number): string {
      return require('crypto').randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
    }

  async createUserWithProfile(userDto: CreateUserDto) {
    const randomPassword = this.generatePassword(10); 
    const hashedPassword = await this.hashedPassword(randomPassword)
    return this.prisma.user.create({
      data: {
          email: userDto.email,
          password: hashedPassword,
          role: userDto.role,
          profile: {
            create: {
            }
          },
        },
        select: {
          id: true,
          role: true,
          emailConfirmed: true,
          profile: true,
          products: true,
          updatedAt: true,
          createdAt: true,
        }
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
    return this.prisma.user.findMany({
      include: {
        profile: true,
        products: true,
      }
    })
    .then(e => e.map(({ password, email, ...rest }) => rest))
    .catch((error) => console.error(error))

  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        emailConfirmed: true,
        profile: true,
        products: true,
        updatedAt: true,
        createdAt: true,
      }})
  }

  update(userId: string, userData: UpdateUserDto) {

    return this.prisma.$transaction(async (prisma) => {
      return prisma.user.update({
        where: {
          id: userId
        },
        data: {
          ...userData,
          profile: {
            update: {
            }
          }
        },
        select: {
          id: true,
          role: true,
          emailConfirmed: true,
          profile: true,
          updatedAt: true,
          createdAt: true,
        }
      });
    })
  }

  async deleteUserAndProfile(userId: string) {
    return this.prisma.$transaction(async (prisma) => {

      await prisma.userProfile.delete({
        where: {
          userId
        }
      });

      return prisma.user.delete({
        where: {
          id: userId
        },
        select: {
          id: true,
          role: true,
          emailConfirmed: true,
          profile: true,
          updatedAt: true,
          createdAt: true,
        }
      });
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
      const encryptedEmail = this.emailService.encryptEmail(user.email);
      return {encryptedEmail};
    }
    if(!user) throw new NotFoundException('User not found');
  }

  async getProfileByUserId(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        profile: true
      }
    })
    .catch(error => {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2023') {
          throw new NotFoundException("User id not found");
        }
      }
      return error
    });
  }

  updateProfile(userId: string, dto: UpdateProfileDto) {

    return this.prisma.$transaction(async (prisma) => {
      return prisma.user.update({
        where: {
          id: userId
        },
        data: {
          ...dto,
          profile: {
            update: {
              ...dto
            }
          }
        },
        select: {
          profile: true
        }
      });
    })
    .catch(error => {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2023') {
          throw new NotFoundException("User id not found");
        }
      }
      return error
    });
  }

}
