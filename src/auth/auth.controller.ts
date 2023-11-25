import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/create-auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Controller('users')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
    ) {}

  @Post('login')
  login(@Body() dto: SignInDto) {
    return this.authService.signIn(dto.email, dto.password)
    .then(r => {
      if(!r) throw new NotFoundException('Failed, not found');
      return r
    });
    }

    @Post("/register")
    create(@Body() userDto: CreateUserDto) {
      return this.userService.createUserWithProfile(userDto)
    }

}
