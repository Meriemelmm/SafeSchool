import { Controller } from '@nestjs/common';
import { EtablissementService } from './etablissement.service';

@Controller('etablissement')
export class EtablissementController {
  constructor(private readonly etablissementService: EtablissementService) {}
}
