import api from '../api';
import type { BillingConfigDto, ApiResponse } from '../../types/superadmin';

export const billingService = {
  getByCountry: async (countryId: string): Promise<BillingConfigDto> => {
    const response = await api.get<ApiResponse<BillingConfigDto>>(`/superadmin/billing-config/${countryId}`);
    return response.data.data;
  },

  update: async (countryId: string, data: Partial<BillingConfigDto>): Promise<BillingConfigDto> => {
    const response = await api.put<ApiResponse<BillingConfigDto>>(`/superadmin/billing-config/${countryId}`, data);
    return response.data.data;
  },
};
