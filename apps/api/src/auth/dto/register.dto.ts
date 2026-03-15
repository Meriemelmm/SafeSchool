import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, Matches, ValidateNested } from 'class-validator';
import { UserRole } from '@shared/enums';
import { Transform, Type } from 'class-transformer';
import { StudentProfileDto, ParentProfileDto, TeacherProfileDto, AdminProfileDto } from '../../users/dto/users.dto';

export class RegisterDto {

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

  @IsNotEmpty({ message: 'password is required' })
  @IsString({ message: 'password must be a string' })
  @MinLength(8, { message: 'password must be at least 8 characters long' })
  password: string;

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
        return class {};
    }
  })
  profileData?: StudentProfileDto | ParentProfileDto | TeacherProfileDto | AdminProfileDto;
}