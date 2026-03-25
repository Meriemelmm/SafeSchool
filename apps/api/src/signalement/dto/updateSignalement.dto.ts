import { PartialType } from '@nestjs/mapped-types';
import { CreateSignalementDto } from './createsignalement.dto';
import { IsArray, IsOptional, ValidateNested, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateMemberDto } from '@/signalement-member/dto/member.dto';

export class UpdateSignalementDto extends PartialType(CreateSignalementDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateMemberDto)
  members?: UpdateMemberDto[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  deletedMemberIds?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  deletedPreuveIds?: string[];
}
