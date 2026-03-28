import { EtablissementType } from '../enums/etablissement-type.enum';

export interface IEtablissement {
  _id: string;
  nom: string;
  adresse: string;
  ville: string;
  code: string;
  type: EtablissementType;
  telephone?: string;
  email?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IGetEtablissementsResponse {
  message: string;
  data: IEtablissement[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
