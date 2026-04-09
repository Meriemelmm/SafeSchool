// shared/interfaces/register.interface.ts
// Ces interfaces sont partagées entre frontend et backend

import { UserRole } from '../enums/role.enum';

export interface IStudentProfile {
  etablissementId?: string;
  classe?: string;
}

export interface IParentProfile {
  relation: 'père' | 'mère' | 'tuteur' | 'autre';
}

export interface ITeacherProfile {
  etablissementId: string;
  matiere?: string;
  classes?: string[];
}

export interface IAdminProfile {
  etablissementId?: string | null;
  canManageAll?: boolean;
}

export type IProfileData =
  | IStudentProfile
  | IParentProfile
  | ITeacherProfile
  | IAdminProfile
  | Record<string, any>;

export interface IRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  profileData: IProfileData;
}

export interface IRegisterFormData extends IRegisterPayload {
  
  ville?: string;
}