import api from '../api';
import { IPreuve } from 'shared/interfaces/signalement.interface';

export const preuveService = {
  async getBySignalement(signalementId: string) {
    const response = await api.get<{ message: string; data: IPreuve[] }>(`/preuve/signalement/${signalementId}`);
    console.log("response",response.data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete<{ message: string }>(`/preuve/${id}`);
    return response.data;
  }
};
