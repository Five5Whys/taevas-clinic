import api from '../api';
import type { DashboardStats, AuditLogEntry, PagedResponse, ApiResponse } from '../../types/superadmin';

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/superadmin/stats');
    return response.data.data;
  },

  getActivity: async (page = 0, size = 20): Promise<PagedResponse<AuditLogEntry>> => {
    const response = await api.get<ApiResponse<PagedResponse<AuditLogEntry>>>('/superadmin/activity', {
      params: { page, size },
    });
    return response.data.data;
  },

  getAiInsights: async (): Promise<string[]> => {
    const response = await api.get<ApiResponse<string[]>>('/superadmin/ai-insights');
    return response.data.data;
  },
};
