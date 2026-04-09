import api from '../api';
import { IEtablissement, IGetEtablissementsResponse } from 'shared/index';

// Named exports for backward compatibility and specific components
export const getEtablissementCities = async (): Promise<string[]> => {
  const response = await api.get('/etablissements/public/cities');
  return response.data.data || [];
};

export const getEtablissementsByCity = async (city: string): Promise<IEtablissement[]> => {
  const response = await api.get('/etablissements/public', { params: { ville: city } });
  return response.data.data || [];
};

// This was used by CreateUserForm
export const getAllEtablissements = async (page = 1, limit = 100): Promise<IEtablissement[]> => {
  const response = await api.get<IGetEtablissementsResponse>('/etablissements', {
    params: { page, limit } // Using page instead of skip
  });
  return response.data.data || [];
};

export const etablissementService = {
  async getAllEtablissements(page = 1, limit = 10, filters: any = {}) {
    // Backend expects 'page' and 'limit'
    const cleanParams: any = { page, limit };
    
    // Only add non-empty filters
    if (filters.search) cleanParams.search = filters.search;
    if (filters.type) cleanParams.type = filters.type;
    if (filters.ville) cleanParams.ville = filters.ville;
    if (filters.isActive !== undefined) cleanParams.isActive = filters.isActive;

    const response = await api.get<IGetEtablissementsResponse>('/etablissements', {
      params: cleanParams
    });
    return response.data;
  },

  async createEtablissement(data: Partial<IEtablissement>) {
    const response = await api.post('/etablissements', data);
    return response.data;
  },

  async updateEtablissement(id: string, data: Partial<IEtablissement>) {
    const response = await api.put(`/etablissements/${id}`, data);
    return response.data;
  },

  async deleteEtablissement(id: string) {
    const response = await api.delete(`/etablissements/${id}`);
    return response.data;
  },

  async toggleActivation(id: string) {
    const response = await api.patch(`/etablissements/${id}/activation`);
    return response.data;
  },
  
  async getEtablissementById(id: string) {
    const response = await api.get(`/etablissements/${id}`);
    return response.data.data;
  },

  // Proxies
  getEtablissementCities,
  getEtablissementsByCity
};

export type { IEtablissement as Etablissement };
