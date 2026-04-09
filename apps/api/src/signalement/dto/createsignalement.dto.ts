// create-signalement.dto.ts

import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsDateString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  NiveauGravite,
  Nature,
  TypeViolence,
  RoleIncident,
  TypeEpreuve,
} from '@shared/enums';

export class CreateSignalementDto {
  @IsString({ message: 'Le titre doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Le titre est obligatoire.' })
  @MinLength(5, { message: 'Le titre doit contenir au moins 5 caractères.' })
  @MaxLength(150, { message: 'Le titre ne peut pas dépasser 150 caractères.' })
  title: string;

  @IsString({ message: 'La description doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'La description est obligatoire.' })
  @MinLength(10, {
    message: 'La description doit contenir au moins 10 caractères.',
  })
  @MaxLength(2000, {
    message: 'La description ne peut pas dépasser 2000 caractères.',
  })
  description: string;

  @IsDateString(
    {},
    {
      message:
        "La date de l'incident doit être une date valide (format ISO 8601).",
    },
  )
  @IsNotEmpty({ message: "La date de l'incident est obligatoire." })
  dateIncident: string;

  @IsString({ message: 'La localisation doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'La localisation est obligatoire.' })
  @MaxLength(300, {
    message: 'La localisation ne peut pas dépasser 300 caractères.',
  })
  location: string;

  @IsEnum(Nature, {
    message: `La nature doit être l'une des valeurs suivantes : ${Object.values(Nature).join(', ')}.`,
  })
  @IsNotEmpty({ message: 'La nature du signalement est obligatoire.' })
  nature: Nature;

  @IsEnum(NiveauGravite, {
    message: `Le niveau de gravité doit être l'une des valeurs suivantes : ${Object.values(NiveauGravite).join(', ')}.`,
  })
  @IsNotEmpty({ message: 'Le niveau de gravité est obligatoire.' })
  gravite: NiveauGravite;

  @IsEnum(TypeViolence, {
    message: `Le type de violence doit être l'une des valeurs suivantes : ${Object.values(TypeViolence).join(', ')}.`,
  })
  @IsNotEmpty({ message: 'Le type de violence est obligatoire.' })
  typeViolence: TypeViolence;

  @IsBoolean({
    message: 'Le champ anonymat doit être un booléen (true/false).',
  })
  @IsOptional()
  isAnonymous?: boolean = false;
}
