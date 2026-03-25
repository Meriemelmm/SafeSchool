// signalement.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { NiveauGravite, StatutSignalement, Nature, TypeViolence } from '@shared/enums';

export type SignalementDocument = HydratedDocument<Signalement>;

@Schema({ timestamps: true, collection: 'signalements' })
export class Signalement {

  @Prop({
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 150,
  })
  title: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 2000,
  })
  description: string;

  @Prop({
    required: true,
    type: Date,
    validate: {
      validator: (v: Date) => v <= new Date(),
      message: 'La date de l\'incident ne peut pas être dans le futur.',
    },
  })
  dateIncident: Date;

  @Prop({
    required: true,
    trim: true,
    maxlength: 300,
  })
  location: string;

  @Prop({
    type: String,
    required: true,
    enum: Nature,
  })
  nature: Nature;

  @Prop({
    required: true,
    type: String,
    enum: NiveauGravite,
  })
  gravite: NiveauGravite;

  @Prop({ default: false })
  isAnonymous: boolean;

  @Prop({
    required: true,
    type: String,
    enum: StatutSignalement,
    default: StatutSignalement.NOUVEAU
  })
  status: StatutSignalement;

  @Prop({
    required: true,
    type: String,
    enum: TypeViolence,
  })
  typeViolence: TypeViolence;

  // ─── Soft delete ────────────────────────────────────────────
  @Prop({ default: false, index: true })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  deletedBy: Types.ObjectId | null;


  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  reportedBy: Types.ObjectId;
}

export const SignalementSchema = SchemaFactory.createForClass(Signalement);


SignalementSchema.index({ reportedBy: 1, isDeleted: 1 });
SignalementSchema.index({ dateIncident: -1 });

