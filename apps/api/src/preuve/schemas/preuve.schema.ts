import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TypeEpreuve } from '@shared/enums';

export type PreuveDocument = HydratedDocument<Preuve>;

@Schema({ timestamps: true, collection: 'preuves' })
export class Preuve {
  @Prop({ required: true })
  fileUrl: string;

  @Prop({ type: String, enum: TypeEpreuve, required: true })
  fileType: TypeEpreuve;

  @Prop({ type: Types.ObjectId, ref: 'Signalement', required: true, index: true })
  signalementId: Types.ObjectId;

  @Prop({ default: Date.now })
  uploadedAt: Date;
}

export const PreuveSchema = SchemaFactory.createForClass(Preuve);
