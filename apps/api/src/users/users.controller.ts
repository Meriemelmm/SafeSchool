import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
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
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async createByAdmin(@Body() userData: UserDto) {
    const newUser = await this.usersService.createByAdmin(userData);
    return {
      message: 'User created successfully',
      data: newUser,
    };
  }
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(@Query() query) {
    const { skip, limit, search, role, status } = query;

    const filter: any = { isDeleted: { $ne: true } };

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) filter.role = role;
    if (status) filter.status = status;

    const result = await this.usersService.findAll(
      filter,
      parseInt(skip) || 0,
      parseInt(limit) || 10,
    );

    return {
      message: 'list des utilisateurs',
      data: result.data,
      total: result.total,
    };
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    const deletedUser = await this.usersService.softDelete(id);
    return {
      message: 'Utilisateur supprimé avec succès',
      data: deletedUser,
    };
  }
}
