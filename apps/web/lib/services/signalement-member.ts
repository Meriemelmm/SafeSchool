import api from '../api';
import { ISignalementMember } from 'shared/interfaces/signalement.interface';
import { MemberFormData } from '@/components/signalement/create/types';

export const signalementMemberService = {

  async getBySignalement(signalementId: string) {
    const response = await api.get<{ message: string; data: ISignalementMember[] }>(
      `/signalement-member/${signalementId}`
    );
    return response.data;
  },

  /**
   * Ajoute un tableau de membres à un signalement existant.
   * Le backend attend : { signalementId: string, members: CreateMemberDto[] }
   */
  async addMembers(signalementId: string, members: MemberFormData[]) {
    const response = await api.post<{ message: string; data: ISignalementMember[] }>(
      '/signalement-member',
      { signalementId, members }
    );
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete<{ message: string }>(`/signalement-member/${id}`);
    return response.data;
  },
};
