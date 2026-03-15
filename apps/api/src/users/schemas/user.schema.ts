
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserRole } from '@shared/index';

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false })
export class StudentProfile {
  @Prop({ type: Types.ObjectId, ref: 'Etablissement', required: false })
  etablissementId?: Types.ObjectId;

  @Prop({ required: true, trim: true })
  numeroScolaire: string;

  @Prop({ required: false, trim: true })
  classe?: string;
}

@Schema({ _id: false })
export class ParentProfile {
 
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  childrenIds: Types.ObjectId[];

  @Prop({
    required: true,
    trim: true,
    enum: ['père', 'mère', 'tuteur', 'autre'],
  })
  relation: string;
}

@Schema({ _id: false })
export class TeacherProfile {
  @Prop({ type: Types.ObjectId, ref: 'Etablissement', required: true })
  etablissementId: Types.ObjectId;

  @Prop({ required: false, trim: true })
  matiere?: string;

  @Prop({ type: [String], default: [] })
  classes: string[];
}

@Schema({ _id: false })
export class AdminProfile {
  @Prop({ type: Types.ObjectId, ref: 'Etablissement', default: null })
  etablissementId: Types.ObjectId | null;

  @Prop({ default: false })
  canManageAll: boolean;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true, match: /^\S+@\S+\.\S+$/, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, minLength: 8 })
  password: string;

  @Prop({ required: true, type: String, enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Prop({
    required: false,
    trim: true,
    match: /^(\+212|0)([5-7][0-9]{8})$/,
  })
  phone?: string;

  @Prop({
    type: String,
    enum: ['PENDING', 'ACTIVE', 'BLOCKED'],
    default: 'PENDING',
  })
  status: string;

  @Prop({ type: Object, default: {} })
  profileData: StudentProfile | ParentProfile | TeacherProfile | AdminProfile | Record<string, any>;

  @Prop({ default: false })
  agreedToTerms: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);



