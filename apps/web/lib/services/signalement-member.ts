import api from '../api';
import { ISignalementMember } from 'shared/interfaces/signalement.interface';

export const signalementMemberService = {
  async getBySignalement(signalementId: string) {
    const response = await api.get<{ message: string; data: ISignalementMember[] }>(`/signalement-member/${signalementId}`);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete<{ message: string }>(`/signalement-member/${id}`);
    return response.data;
  }
};
