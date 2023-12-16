import { Controller, Post, Body, NotFoundException, ForbiddenException,} from '@nestjs/common';
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
  async login(@Body() dto: SignInDto) {
    return this.authService.signIn(dto.email, dto.password)
    .then(r => {
      if(!r) throw new NotFoundException('Failed, not found');
      return r
    });
    }

    @Post("/register")
    create(@Body() userDto: CreateUserDto) {
      const userRole = userDto.role;

      if (userRole !== 'ADMIN') {
        return this.userService.createUserWithProfile(userDto)
      } else {
        throw new ForbiddenException('You cannot register a user with the ADMIN role');
      }
    }
}

