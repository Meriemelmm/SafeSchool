import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3007',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {

    if (typeof window === 'undefined') {
      try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const refreshToken = cookieStore.get('refresh_token')?.value;

        if (token && config.headers) {
          config.headers.Cookie = `token=${token}; refresh_token=${refreshToken || ''}`;
        }
      } catch (e) {

      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {

      if (error.response.status === 401) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }

      if (error.response.status === 403) {
        console.error('Access forbidden');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
