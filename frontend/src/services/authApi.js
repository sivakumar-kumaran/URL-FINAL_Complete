import api from './api';

export const authApi = {
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async ({ name, password }) => {
    const response = await api.put('/auth/profile', { name, password });
    return response.data;
  },
};

export default authApi;
