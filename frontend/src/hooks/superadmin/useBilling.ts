import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingService } from '../../services/superadmin/billingService';
import { BillingConfigDto } from '../../types/superadmin';

export const useBillingConfig = (countryId: string) => {
  return useQuery({
    queryKey: ['superadmin', 'billing-config', countryId],
    queryFn: () => billingService.getByCountry(countryId),
    enabled: !!countryId,
  });
};

export const useUpdateBilling = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ countryId, data }: { countryId: string; data: Partial<BillingConfigDto> }) =>
      billingService.update(countryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'billing-config'] });
    },
  });
};
