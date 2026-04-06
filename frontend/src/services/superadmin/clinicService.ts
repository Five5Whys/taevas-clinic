import api from '../api';
import type { ClinicSummary, PagedResponse, ApiResponse } from '../../types/superadmin';

export interface ClinicListParams {
  countryId?: string;
  status?: string;
  search?: string;
  page?: number;
  size?: number;
}

export const clinicService = {
  getAll: async (params: ClinicListParams = {}): Promise<PagedResponse<ClinicSummary>> => {
    const response = await api.get<ApiResponse<PagedResponse<ClinicSummary>>>('/superadmin/clinics', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<ClinicSummary> => {
    const response = await api.get<ApiResponse<ClinicSummary>>(`/superadmin/clinics/${id}`);
    return response.data.data;
  },

  create: async (data: Partial<ClinicSummary>): Promise<ClinicSummary> => {
    const response = await api.post<ApiResponse<ClinicSummary>>('/superadmin/clinics', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<ClinicSummary>): Promise<ClinicSummary> => {
    const response = await api.put<ApiResponse<ClinicSummary>>(`/superadmin/clinics/${id}`, data);
    return response.data.data;
  },
};
