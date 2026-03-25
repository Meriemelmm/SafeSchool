import { Controller, Post, Body,Delete, UseGuards, Req, Get, Query, Param, Patch, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { SignalementService } from './signalement.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CreateSignalementDto } from '@/signalement/dto/createsignalement.dto';
import { UpdateSignalementDto } from '@/signalement/dto/updateSignalement.dto';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole, StatutSignalement } from '@shared/enums';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Types } from 'mongoose';
import {ParseObjectIdPipe} from '@/common/pipes/parse-object-id.pipe';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '@/common/upload.config';


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

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @CurrentUser() currentUser) {
    console.log("id", id);
    const signalement = await this.signalementService.findOne(id, currentUser);
    return {
      message: 'Signalement récupéré avec succès',
      data: signalement,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARENT, UserRole.STUDENT)
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() body: UpdateSignalementDto,
    @CurrentUser() currentUser,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    const signalement = await this.signalementService.updateSignalement(id, body, currentUser, files);
    return {
      message: 'Signalement mis à jour avec succès',
      data: signalement,
    };
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async updateStatus(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body('status') status: StatutSignalement,
  ) {
    const updated = await this.signalementService.updateStatusSignalement(
      id,
      status
    );
    return {
      message: "Statut mis à jour avec succès",
      data: updated,
    };
  }
  @Delete(':id')
@UseGuards(JwtAuthGuard)
async delete(
  @Param('id', ParseObjectIdPipe) id: string,
  @CurrentUser() CurrentUser,
): Promise<{ message: string }> {

  await this.signalementService.deleteSignalement(
    id,
    CurrentUser.id,
    CurrentUser.role
  );

  return { message: 'Signalement deleted successfully' };
}
}
