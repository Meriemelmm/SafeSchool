import { Nature, TypeViolence, NiveauGravite, StatutSignalement } from '../enums/signalement-enums';
import { TypeEpreuve } from '../enums/preuve-type.enum';
import { RoleIncident } from '../enums/roleIncedent.enum';

export interface ISignalement {
  _id: string;
  title: string;
  description: string;
  dateIncident: string;
  location: string;
  nature: Nature;
  gravite: NiveauGravite;
  isAnonymous: boolean;
  status: StatutSignalement;
  typeViolence: TypeViolence;
  reportedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ISignalementMember {
  _id: string;
  firstName: string;
  lastName: string;
  role: RoleIncident;
  signalementId: string;
}

export interface IPreuve {
  _id: string;
  fileUrl: string;
  fileType: TypeEpreuve;
  signalementId: string;
  uploadedAt: string;
}

export interface ISignalementDetail extends ISignalement {
  members?: ISignalementMember[];
  preuves?: IPreuve[];
}

export interface IPaginatedSignalements {
  data: ISignalement[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
