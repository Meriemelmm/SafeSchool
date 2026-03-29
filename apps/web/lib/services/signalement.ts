import api from '../api';
import { IPaginatedSignalements, ISignalement, ISignalementDetail } from 'shared/interfaces/signalement.interface';
import { StatutSignalement } from 'shared/enums/signalement-enums';


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

  async delete(id: string) {
    const response = await api.delete<{ message: string }>(`/signalement/${id}`);
    return response.data;
  }
};
