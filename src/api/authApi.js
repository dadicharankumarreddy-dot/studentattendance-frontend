import axiosClient from './axiosClient';

export const authApi = {
  register: async (userData) => {
    const res = await axiosClient.post('/api/auth/register', userData);
    return res.data;
  },

  login: async (credentials) => {
    const res = await axiosClient.post('/api/auth/login', credentials);
    return res.data;
  },

  getMe: async () => {
    const res = await axiosClient.get('/api/auth/me');
    return res.data;
  },
};
