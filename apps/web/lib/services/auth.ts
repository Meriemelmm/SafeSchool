import api from '../api';

export type AuthUser = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    profileData?: any;
};

export type RegisterPayload = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
    profileData?: any;
};

export type LoginPayload = {
    email: string;
    password: string;
};

export const register = async (payload: RegisterPayload) => {
    const response = await api.post('/auth/register', payload);
    return response.data;
};

export const login = async (payload: LoginPayload) => {
    const response = await api.post('/auth/login', payload);
    return response.data;
};

export const logout = async () => {
    const response = await api.post('/auth/logout');
    return response.data;
};

export const getProfile = async () => {
    const response = await api.get('/auth/profile');
    return response.data;
};
