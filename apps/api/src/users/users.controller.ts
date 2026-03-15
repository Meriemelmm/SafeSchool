import { Controller, Get, Post, Body, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@shared/index';
import { UserDto } from './dto/users.dto';

import * as crypto from 'crypto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
   
  ) {}

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN)
   @Post()

async createByAdmin(@Body() userData: UserDto) {
  const newUser = await this.usersService.createByAdmin(userData);  
  return {
    message: "User created successfully",  
    data: newUser
  }
}





  
}
