import { PartialType } from '@nestjs/mapped-types';
import { CreateSignalementDto } from './createsignalement.dto';
import { IsArray, IsOptional, ValidateNested, IsMongoId } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { UpdateMemberDto } from '@/signalement-member/dto/member.dto';

export class UpdateSignalementDto extends PartialType(CreateSignalementDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateMemberDto)
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  members?: UpdateMemberDto[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  deletedMemberIds?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  deletedPreuveIds?: string[];
}

