 import { CreateEtablissementDto } from "@/etablissement/dto/EtablssementCreate.dto";
 import { PartialType } from "@nestjs/mapped-types";
  export class EtablissementUpdateDto extends PartialType(CreateEtablissementDto) {}