import api from '../api';
import { FieldDefinitionDto, ApiResponse } from '../../types/superadmin';

export const fieldService = {
  getFields: async (section: string, countryId?: string): Promise<FieldDefinitionDto[]> => {
    const response = await api.get<ApiResponse<FieldDefinitionDto[]>>('/superadmin/fields', {
      params: { section, countryId },
    });
    return response.data.data;
  },

  addField: async (data: Partial<FieldDefinitionDto>): Promise<FieldDefinitionDto> => {
    const response = await api.post<ApiResponse<FieldDefinitionDto>>('/superadmin/fields', data);
    return response.data.data;
  },

  updateField: async (id: string, data: Partial<FieldDefinitionDto>): Promise<FieldDefinitionDto> => {
    const response = await api.put<ApiResponse<FieldDefinitionDto>>(`/superadmin/fields/${id}`, data);
    return response.data.data;
  },

  deleteField: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/superadmin/fields/${id}`);
  },

  toggleLock: async (id: string): Promise<FieldDefinitionDto> => {
    const response = await api.put<ApiResponse<FieldDefinitionDto>>(`/superadmin/fields/${id}/lock`);
    return response.data.data;
  },

  reorderFields: async (orderedIds: string[]): Promise<void> => {
    await api.put<ApiResponse<void>>('/superadmin/fields/reorder', orderedIds);
  },
};
