import { Controller, Post, Body, UseGuards, Req, Get,Query } from '@nestjs/common';
import { SignalementService } from './signalement.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CreateSignalementDto } from '@/signalement/dto/createsignalement.dto';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@shared/enums';

@Controller('signalement')
@UseGuards(JwtAuthGuard)
export class SignalementController {
  constructor(private readonly signalementService: SignalementService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.PARENT)
  async create(
    @Body() body: CreateSignalementDto,
    @Req() req
  ) {
    const signalement = await this.signalementService.create(body, req.user.id);
    return {
      message: 'Le signalement a été créé avec succès',
      data: signalement
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
 async findAll(@Query() query) {
  const result = await this.signalementService.findAll(query);
  return {
    message: 'Liste des signalements récupérée avec succès',
    ...result,
  };
}
}
