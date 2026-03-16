// etablissement.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {EtablissementType } from '@shared/enums';

export type EtablissementDocument = HydratedDocument<Etablissement>;



@Schema({ timestamps: true })
export class Etablissement {

  @Prop({ required: true, trim: true })
  nom: string;

  @Prop({ required: true, trim: true, index: true })
  ville: string;

  @Prop({ required: true, trim: true })
  adresse: string;

  @Prop({
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true,
  })
  code: string; 

  @Prop({
    type: String,
    enum: EtablissementType,
    required: true,
  })
  type: EtablissementType;
  // ─── Statut opérationnel ───────────────────
  @Prop({ trim: true })
  telephone: string;

  @Prop({ trim: true, lowercase: true })
  email: string;

  @Prop({ default: true })
  isActive: boolean;
  @Prop({ default: false })
isDeleted: boolean;  

@Prop({ type: Date, default: null })
deletedAt: Date | null; 
}


export const EtablissementSchema =
  SchemaFactory.createForClass(Etablissement);