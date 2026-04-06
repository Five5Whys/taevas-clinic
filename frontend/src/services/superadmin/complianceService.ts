import api from '../api';
import type { ComplianceModuleDto, ApiResponse } from '../../types/superadmin';

export const complianceService = {
  getByCountry: async (countryId: string): Promise<ComplianceModuleDto[]> => {
    const response = await api.get<ApiResponse<ComplianceModuleDto[]>>(`/superadmin/compliance/${countryId}`);
    return response.data.data;
  },

  toggleModule: async (countryId: string, moduleId: string): Promise<void> => {
    await api.put<ApiResponse<void>>(`/superadmin/compliance/${countryId}/${moduleId}`);
  },
};
