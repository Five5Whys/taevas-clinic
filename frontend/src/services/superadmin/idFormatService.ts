import api from '../api';
import { IdFormatTemplateDto, ApiResponse } from '../../types/superadmin';

export const idFormatService = {
  getByCountry: async (countryId: string): Promise<IdFormatTemplateDto[]> => {
    const response = await api.get<ApiResponse<IdFormatTemplateDto[]>>(`/superadmin/id-formats/${countryId}`);
    return response.data.data;
  },

  update: async (countryId: string, entityType: string, data: Partial<IdFormatTemplateDto>): Promise<IdFormatTemplateDto> => {
    const response = await api.put<ApiResponse<IdFormatTemplateDto>>(`/superadmin/id-formats/${countryId}/${entityType}`, data);
    return response.data.data;
  },

  toggleLock: async (countryId: string, entityType: string): Promise<void> => {
    await api.put<ApiResponse<void>>(`/superadmin/id-formats/${countryId}/${entityType}/lock`);
  },
};
