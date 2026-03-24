import { Controller, Post, UseGuards,Get,Param ,UseInterceptors, UploadedFiles, Body, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PreuveService } from './preuve.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { multerConfig } from '@/common/upload.config';
import { CreatePreuveDto } from './dto/create-preuve.dto';
import { RolesGuard } from '@/common/guards/roles.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

 

@Controller('preuve')
@UseGuards(JwtAuthGuard)
export class PreuveController {
  constructor(private readonly preuveService: PreuveService) {}

  @Post()
  @UseGuards(JwtAuthGuard,RolesGuard)
   @UseInterceptors(FilesInterceptor('files', 10, multerConfig)) 
  async uploadPreuves(
    @Body() createPreuveDto: CreatePreuveDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Aucun fichier n\'a été téléchargé');
    }
    await this.preuveService.createManyFromUploadedFiles(files, createPreuveDto.signalementId);
    return {
      message: 'Les preuves ont été ajoutées avec succès',
    };
  }
   @Get('signalement/:id')
   @UseGuards(JwtAuthGuard)
    async    PreuveBysignalement(@Param('id') id,@CurrentUser() CurrentUser){
      console.log("id",id);
       const  preuves= await this.preuveService.findAllPreuvesBySignalement(id,CurrentUser);
       return {
      message: "Les preuves récupérées avec succès",
         data:preuves
       }

    }
}
