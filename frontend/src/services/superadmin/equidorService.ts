import api from '../api';
import { EquidorSessionDto, EquidorFileDto, ApiResponse } from '../../types/superadmin';

export interface EquidorSessionParams {
  dateFrom?: string;
  dateTo?: string;
  type?: string;
  status?: string;
  search?: string;
}

export const equidorService = {
  getSessions: async (params: EquidorSessionParams = {}): Promise<EquidorSessionDto[]> => {
    const response = await api.get<ApiResponse<EquidorSessionDto[]>>('/superadmin/equidor/sessions', { params });
    return response.data.data;
  },

  getSession: async (cid: string): Promise<EquidorSessionDto> => {
    const response = await api.get<ApiResponse<EquidorSessionDto>>(`/superadmin/equidor/sessions/${cid}`);
    return response.data.data;
  },

  getFile: async (fileId: string): Promise<EquidorFileDto> => {
    const response = await api.get<ApiResponse<EquidorFileDto>>(`/superadmin/equidor/files/${fileId}`);
    return response.data.data;
  },

  retrySession: async (cid: string): Promise<void> => {
    await api.post<ApiResponse<void>>(`/superadmin/equidor/sessions/${cid}/retry`);
  },
};
