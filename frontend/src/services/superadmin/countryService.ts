import api from '../api';
import { CountryConfig, ApiResponse } from '../../types/superadmin';

export const countryService = {
  getAll: async (): Promise<CountryConfig[]> => {
    const response = await api.get<ApiResponse<CountryConfig[]>>('/superadmin/countries');
    return response.data.data;
  },

  getById: async (id: string): Promise<CountryConfig> => {
    const response = await api.get<ApiResponse<CountryConfig>>(`/superadmin/countries/${id}`);
    return response.data.data;
  },

  create: async (data: Partial<CountryConfig>): Promise<CountryConfig> => {
    const response = await api.post<ApiResponse<CountryConfig>>('/superadmin/countries', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<CountryConfig>): Promise<CountryConfig> => {
    const response = await api.put<ApiResponse<CountryConfig>>(`/superadmin/countries/${id}`, data);
    return response.data.data;
  },
};
