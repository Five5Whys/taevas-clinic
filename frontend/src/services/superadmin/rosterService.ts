import api from '../api';
import type { DoctorRosterDto, PagedResponse, ApiResponse } from '../../types/superadmin';

export interface RosterListParams {
  country?: string;
  search?: string;
  page?: number;
  size?: number;
}

export const rosterService = {
  getAll: async (params: RosterListParams = {}): Promise<PagedResponse<DoctorRosterDto>> => {
    const response = await api.get<ApiResponse<PagedResponse<DoctorRosterDto>>>('/superadmin/doctors', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<DoctorRosterDto> => {
    const response = await api.get<ApiResponse<DoctorRosterDto>>(`/superadmin/doctors/${id}`);
    return response.data.data;
  },

  updateRoles: async (id: string, roles: string[]): Promise<void> => {
    await api.put<ApiResponse<void>>(`/superadmin/doctors/${id}/roles`, roles);
  },

  deactivate: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/superadmin/doctors/${id}`);
  },
};
