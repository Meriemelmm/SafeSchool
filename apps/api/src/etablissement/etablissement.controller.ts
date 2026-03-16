import { Controller, Post, Body, Get, Query, UseGuards,Put, Param,Delete, Patch } from '@nestjs/common';
import { EtablissementService } from './etablissement.service';
import { CreateEtablissementDto } from '@/etablissement/dto/EtablssementCreate.dto';
import { QueryEtablissementDto } from './dto/query-etablissement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@shared/index';
import {EtablissementUpdateDto} from '@/etablissement/dto/EtablissementUpdate.dto';
import {Types} from 'mongoose';

@Controller('etablissements')
export class EtablissementController {
  constructor(private readonly etablissementService: EtablissementService) {}

  // ─── POST /etablissements ──────────────────────────────────────────────────
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createEtablissementDto: CreateEtablissementDto) {
    return this.etablissementService.create(createEtablissementDto);
  }

  
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(@Query() query: QueryEtablissementDto) {
    const result = await this.etablissementService.findAll(query);
    return {
      message: 'Liste des établissements',
      ...result,
    };
  }
 @Get(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
async findOne(@Param('id') id: Types.ObjectId) {
  const etablissement = await this.etablissementService.findOne(id);
  return {
    message: 'Détails de l’établissement', 
    data: etablissement,
  };
}
 @Patch(':id/activation')
 @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
async DesOrActive(@Param('id')id:Types.ObjectId){
  return this.etablissementService.DesOrActive(id);

}
 @Put(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
async update(
  @Param('id') id: Types.ObjectId,
  @Body() body: EtablissementUpdateDto
) {
  const updated = await this.etablissementService.update(id, body);
  return {
    message: "La mise à jour a été effectuée avec succès", 
    data: updated,
  };
}

@Delete(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
softDelete(@Param('id') id: Types.ObjectId) {
    return this.etablissementService.softDelete(id);
  }

}
