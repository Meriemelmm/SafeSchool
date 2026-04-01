import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TypeNotification } from '@shared/enums';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, enum: TypeNotification })
  type: TypeNotification;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  destinataireId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Signalement', required: true })
  signalementId: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
