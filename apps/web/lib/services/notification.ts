import api from '../api';

export const notificationService = {
  /**
   * Récupère l'historique des notifications
   */
  async getMyNotifications() {
    const response = await api.get('/notifications');
    return response.data;
  },

  /**
   * Marque une notification comme lue
   */
  async markAsRead(id: string) {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  }
};
