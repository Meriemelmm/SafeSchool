import { IsOptional, IsString, IsBoolean, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { EtablissementType } from '@shared/enums';

export class QueryEtablissementDto {
  // ── Recherche full-text (nom, code, ville) ──────────────────────────────
  @IsOptional()
  @IsString()
  search?: string;

  // ── Filtres spécifiques ─────────────────────────────────────────────────
  @IsOptional()
  @IsEnum(EtablissementType, { message: 'Type invalide' })
  type?: EtablissementType;

  @IsOptional()
  @IsString()
  ville?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;

  // ── Pagination ───────────────────────────────────────────────────────────
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
