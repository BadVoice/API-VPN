import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateProfileDto } from './dto/create-profile.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/register")
  create(@Body() userDto: CreateUserDto) {
    return this.userService.createUserWithProfile(userDto)
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
    .then(r => {
      if(!r) throw new NotFoundException('User not found');
      return r
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.deleteUserAndProfile(id)
    .then(r => {
      if(!r) throw new NotFoundException('User not found');
      return r
    });
  }

  @Get(':userId/email')
  getUserEmail(@Param('userId') userId: string) {
    return this.userService.getUserEmailById(userId)
    .then(r => {
      if(!r) throw new NotFoundException('User not found');
      return r
    });
  }

  @Get('profiles/:userId')
  getProfileByUserId(@Param('userId') userId: string) {
    return this.userService.getProfileByUserId(userId)
    .then(r => {
      if(!r) throw new NotFoundException('User not found');
      return r
    });
  }

  @Patch('profiles/:userId')
  updateProfile(@Param('userId') userId: string,  
  @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(userId, dto)
    .then(r => {
      if(!r) throw new NotFoundException('User not found');
      return r
    });
  }
}
