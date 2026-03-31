import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
  IsMongoId,
  ArrayNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RoleIncident } from '@shared/enums';

export class CreateMemberDto {
  @IsNotEmpty({ message: 'Le firstName est obligatoire.' })
  @IsString({ message: 'Le firstName doit être une chaîne de caractères.' })
  @MinLength(2, {
    message: 'Le firstName doit contenir au moins 2 caractères.',
  })
  @MaxLength(50, {
    message: 'Le firstName ne peut pas dépasser 50 caractères.',
  })
  firstName: string;

  @IsNotEmpty({ message: 'Le lastName est obligatoire.' })
  @IsString({ message: 'Le lastName doit être une chaîne de caractères.' })
  @MinLength(2, { message: 'Le lastName doit contenir au moins 2 caractères.' })
  @MaxLength(50, { message: 'Le lastName ne peut pas dépasser 50 caractères.' })
  lastName: string;

  @IsNotEmpty({ message: "Le rôle dans l'incident est obligatoire." })
  @IsEnum(RoleIncident, {
    message: `Le rôle doit être l'une des valeurs suivantes : ${Object.values(RoleIncident).join(', ')}`,
  })
  role: RoleIncident;
}

export class AddMembersDto {
  @IsNotEmpty({ message: 'Le signalementId est obligatoire.' })
  @IsMongoId({ message: 'Le signalementId doit être un MongoId valide.' })
  signalementId: string;

  @IsArray({ message: 'Members doit être un tableau.' })
  @ArrayNotEmpty({ message: 'Le tableau members ne peut pas être vide.' })
  @ValidateNested({ each: true })
  @Type(() => CreateMemberDto)
  members: CreateMemberDto[];
}

export class UpdateMemberDto extends CreateMemberDto {
  @IsOptional()
  @IsMongoId({ message: "L'ID du membre doit être un MongoId valide." })
  _id?: string;
}
