import api from '../api';
import type { LocaleSettingsDto, ApiResponse } from '../../types/superadmin';

export const localeService = {
  getByCountry: async (countryId: string): Promise<LocaleSettingsDto> => {
    const response = await api.get<ApiResponse<LocaleSettingsDto>>(`/superadmin/locale/${countryId}`);
    return response.data.data;
  },

  update: async (countryId: string, data: Partial<LocaleSettingsDto>): Promise<LocaleSettingsDto> => {
    const response = await api.put<ApiResponse<LocaleSettingsDto>>(`/superadmin/locale/${countryId}`, data);
    return response.data.data;
  },
};
