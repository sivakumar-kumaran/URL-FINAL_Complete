import api from './api';

export const analyticsApi = {
  getUrlAnalytics: async (id) => {
    const response = await api.get(`/analytics/${id}`);
    return response.data;
  },

  getDashboardSummary: async () => {
    const response = await api.get('/analytics/dashboard/summary');
    return response.data;
  },
};

export default analyticsApi;
