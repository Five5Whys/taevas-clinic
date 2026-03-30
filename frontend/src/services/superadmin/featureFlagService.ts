import api from '../api';
import { FeatureFlagDto, ApiResponse } from '../../types/superadmin';

export const featureFlagService = {
  getAll: async (): Promise<FeatureFlagDto[]> => {
    const response = await api.get<ApiResponse<FeatureFlagDto[]>>('/superadmin/feature-flags');
    return response.data.data;
  },

  toggleCountry: async (flagId: string, countryId: string, enabled: boolean): Promise<void> => {
    await api.put<ApiResponse<void>>(`/superadmin/feature-flags/${flagId}/countries/${countryId}`, { enabled });
  },

  toggleLock: async (flagId: string): Promise<void> => {
    await api.put<ApiResponse<void>>(`/superadmin/feature-flags/${flagId}/lock`);
  },

  getImpact: async (flagId: string): Promise<any> => {
    const response = await api.get<ApiResponse<any>>(`/superadmin/feature-flags/${flagId}/impact`);
    return response.data.data;
  },
};
