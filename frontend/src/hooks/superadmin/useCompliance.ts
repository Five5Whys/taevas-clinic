import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complianceService } from '../../services/superadmin/complianceService';

export const useCompliance = (countryId: string) => {
  return useQuery({
    queryKey: ['superadmin', 'compliance', countryId],
    queryFn: () => complianceService.getByCountry(countryId),
    enabled: !!countryId,
  });
};

export const useToggleModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ countryId, moduleId }: { countryId: string; moduleId: string }) =>
      complianceService.toggleModule(countryId, moduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'compliance'] });
    },
  });
};
