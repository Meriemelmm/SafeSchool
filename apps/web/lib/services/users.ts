import api from '../api';
import { IUser, IGetUsersResponse } from 'shared/index';

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
}

export const userService = {
  async getAllUsers(page = 1, limit = 10, filters: UserFilters = {}) {
    const skip = (page - 1) * limit;
    
    const activeParams: any = { skip, limit };
    if (filters.search) activeParams.search = filters.search;
    if (filters.role) activeParams.role = filters.role;
    if (filters.status) activeParams.status = filters.status;

    const response = await api.get<IGetUsersResponse>('/users', {
      params: activeParams
    });
    return response.data;
  },

  async createUser(userData: any) {
    const response = await api.post('/users', userData);
    return response.data;
  },

  async deleteUser(id: string) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

export type { IUser as User };
