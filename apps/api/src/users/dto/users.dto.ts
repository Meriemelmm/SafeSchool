import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
  ValidateNested,
  IsMongoId,
  IsArray,
  IsBoolean,
  IsIn,
} from 'class-validator';
import { UserRole } from '@shared/enums';
import { Transform, Type } from 'class-transformer';

export class StudentProfileDto {
  @IsOptional()
  @IsMongoId({ message: "L'ID de l'établissement doit être valide" })
  etablissementId?: string;

  

  @IsOptional()
  @IsString()
  classe?: string;
}

export class ParentProfileDto {
  @IsNotEmpty({ message: 'La relation est obligatoire pour un parent' })
  @IsIn(['père', 'mère', 'tuteur', 'autre'], { message: 'Relation invalide' })
  relation: string;
}

export class TeacherProfileDto {
  @IsNotEmpty({ message: "L'établissement est obligatoire pour un professeur" })
  @IsMongoId()
  etablissementId: string;

  @IsOptional()
  @IsString()
  matiere?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  classes?: string[];
}

export class AdminProfileDto {
  @IsOptional()
  @IsMongoId()
  etablissementId?: string;

  @IsOptional()
  @IsBoolean()
  canManageAll?: boolean;
}

export class UserDto {
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'firstName is required' })
  @IsString({ message: 'firstName must be a string' })
  @MinLength(3, { message: 'firstName must be at least 3 characters' })
  firstName: string;

  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'lastName is required' })
  @IsString({ message: 'lastName must be a string' })
  @MinLength(3, { message: 'lastName must be at least 3 characters' })
  lastName: string;

  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  @IsEnum(UserRole, { message: 'role must be a valid user role' })
  role: UserRole;

  @IsOptional()
  @Matches(/^(\+212|0)([5-7][0-9]{8})$/, {
    message: 'Phone number must be a valid Moroccan phone number',
  })
  phone?: string;

  @IsOptional()
  @IsIn(['PENDING', 'ACTIVE', 'BLOCKED'])
  status?: string;

  @IsOptional()
  @IsBoolean()
  agreedToTerms?: boolean;

  @ValidateNested()
  @Type((opts) => {
    switch (opts?.object?.role) {
      case UserRole.STUDENT:
        return StudentProfileDto;
      case UserRole.PARENT:
        return ParentProfileDto;
      case UserRole.TEACHER:
        return TeacherProfileDto;
      case UserRole.ADMIN:
        return AdminProfileDto;
      default:
        // Par défaut, aucun sous-objet n'est attendu si le rôle n'est pas reconnu
        return class {};
    }
  })
  profileData?:
    | StudentProfileDto
    | ParentProfileDto
    | TeacherProfileDto
    | AdminProfileDto;
}
