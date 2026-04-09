import api from '../api';
import { IPreuve } from 'shared/interfaces/signalement.interface';

export const preuveService = {
  async getBySignalement(signalementId: string) {
    const response = await api.get<{ message: string; data: IPreuve[] }>(
      `/preuve/signalement/${signalementId}`
    );
    return response.data;
  },

  /**
   * Upload des fichiers (preuves) pour un signalement.
   * Le backend attend un multipart/form-data avec :
   *   - Body field : signalementId (string)
   *   - Files field : files[] (fichiers)
   * POST /preuve
   */
  async uploadFiles(signalementId: string, files: File[]) {
    const fd = new FormData();
    fd.append('signalementId', signalementId);
    files.forEach(file => fd.append('files', file));

    const response = await api.post<{ message: string }>(
      '/preuve',
      fd,
      {
        headers: {
         
          'Content-Type': undefined as any,
        },
      }
    );
    console.log("response",response.data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete<{ message: string }>(`/preuve/${id}`);
    return response.data;
  },
};
