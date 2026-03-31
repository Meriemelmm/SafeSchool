import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EtablissementService } from './etablissement.service';
import { EtablissementController } from './etablissement.controller';
import {
  Etablissement,
  EtablissementSchema,
} from './schemas/etablissement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Etablissement.name, schema: EtablissementSchema },
    ]),
  ],
  controllers: [EtablissementController],
  providers: [EtablissementService],
})
export class EtablissementModule {}
