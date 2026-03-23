import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { RoleIncident } from '@shared/enums';

export type SignalementMemberDocument = HydratedDocument<SignalementMember>;

@Schema({ timestamps: true, collection: 'signalementmembers' })
export class SignalementMember {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ type: String, enum: RoleIncident, required: true })
  role: RoleIncident;

  @Prop({ type: Types.ObjectId, ref: 'Signalement', required: true, index: true })
  signalementId: Types.ObjectId;
}

export const SignalementMemberSchema = SchemaFactory.createForClass(SignalementMember);
