
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {UserRole } from '@shared/index';

export type EtablissementDocument = HydratedDocument<Etablissement>;



@Schema({ timestamps: true })
export class Etablissement {
 
 
    
  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
  
}

export const EtablissementSchema = SchemaFactory.createForClass(Etablissement);
