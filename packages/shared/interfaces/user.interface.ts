import { UserRole } from '../enums/role.enum';
import { IProfileData } from './register.interface';

export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string; // Virtual or concatenated
  role: UserRole;
  phone?: string;
  status: 'PENDING' | 'ACTIVE' | 'BLOCKED';
  isDeleted?: boolean;
  profileData?: IProfileData;
  createdAt: string;
  updatedAt: string;
}

export interface IGetUsersResponse {
  message: string;
  data: IUser[];
  total: number;
}
