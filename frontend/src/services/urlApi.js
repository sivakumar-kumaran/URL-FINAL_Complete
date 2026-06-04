import api from './api';

export const urlApi = {
  createUrl: async ({ originalUrl, customAlias, expiresAt, password }) => {
    const response = await api.post('/urls', { originalUrl, customAlias, expiresAt, password });
    return response.data;
  },

  createBulkUrls: async (urls) => {
    const response = await api.post('/urls/bulk', { urls });
    return response.data;
  },

  getUrls: async ({ search = '', sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = {}) => {
    const params = {};
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    if (page) params.page = page;
    if (limit) params.limit = limit;

    const response = await api.get('/urls', { params });
    return response.data;
  },

  getUrl: async (id) => {
    const response = await api.get(`/urls/${id}`);
    return response.data;
  },

  updateUrl: async ({ id, originalUrl, customAlias, expiresAt, isActive, password }) => {
    const response = await api.put(`/urls/${id}`, { originalUrl, customAlias, expiresAt, isActive, password });
    return response.data;
  },

  deleteUrl: async (id) => {
    const response = await api.delete(`/urls/${id}`);
    return response.data;
  },
};

export default urlApi;
