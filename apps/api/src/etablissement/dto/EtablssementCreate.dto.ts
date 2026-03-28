// create-etablissement.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { EtablissementType } from '@shared/enums';

export class CreateEtablissementDto {

  @IsString()
  @IsNotEmpty({ message: 'Le nom est requis' })
  nom: string;                    

  @IsString()
  @IsNotEmpty({ message: "L'adresse est requise" })
  adresse: string;                 

  @IsString()
  @IsNotEmpty({ message: 'La ville est requise' })
  ville: string;

  @IsString()
  @IsNotEmpty({ message: 'Le code est requis' })
  code: string;

  @IsEnum(EtablissementType, {   
    message: 'Type invalide — valeurs: ecole, college, lycee',
  })
  @IsNotEmpty()
  type: EtablissementType;

  @IsString()
  @IsOptional()
  telephone?: string;              

  @IsEmail({}, { message: 'Email invalide' })
  @IsOptional()                    
  email?: string;

  @IsOptional()
  isActive?: boolean;
}