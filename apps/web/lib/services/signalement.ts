import api from '../api';
import { IPaginatedSignalements, ISignalement, ISignalementDetail } from 'shared/interfaces/signalement.interface';
import { StatutSignalement } from 'shared/enums/signalement-enums';
import { MemberFormData } from '@/components/signalement/create/types';
import { SignalementFormData } from '@/components/signalement/create/types'


export interface SignalementFilters {
  status?: StatutSignalement;
  nature?: string;
  typeViolence?: string;
  search?: string;
}

export const signalementService = {
  async getAll(page = 1, limit = 10, filters: SignalementFilters = {}) {
    const activeParams: any = { page, limit };
    if (filters.search) activeParams.search = filters.search;
    if (filters.status) activeParams.status = filters.status;
    if (filters.nature) activeParams.nature = filters.nature;
    if (filters.typeViolence) activeParams.typeViolence = filters.typeViolence;

    const response = await api.get<IPaginatedSignalements>('/signalement', {
      params: activeParams
    });
    return response.data;
  },

  async getOne(id: string) {
    const response = await api.get<{ message: string, data: ISignalementDetail }>(`/signalement/${id}`);
    return response.data;
  },

  async updateStatus(id: string, status: StatutSignalement) {
    const response = await api.patch<{ message: string, data: ISignalement }>(`/signalement/${id}/status`, { status });
    return response.data;
  },

  async create(data: SignalementFormData) {
    const response = await api.post<{ message: string, data: ISignalement }>('/signalement', data);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await api.patch<{ message: string, data: ISignalement }>(`/signalement/${id}`, data);
    return response.data;
  },

  /**
   * Attache des membres et/ou des fichiers à un signalement existant via multipart/form-data.
   * Le Content-Type par défaut est supprimé pour qu'axios définisse le bon boundary multipart.
   */


  async getMyReports(page = 1, limit = 10, search?: string) {
    const params: any = { page, limit };
    if (search) params.search = search;

    const response = await api.get<IPaginatedSignalements>('/signalement/my-reports', {
      params
    });
    console.log("singalments", response.data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete<{ message: string }>(`/signalement/${id}`);
    return response.data;
  },
   async signalementByNature (nature:string){
     const response= await api.get('/signalement/nature');
     console.log("response.data",response.data);
     return response.data;

   }
};
