import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { featureFlagService } from '../../services/superadmin/featureFlagService';

export const useFeatureFlags = () => {
  return useQuery({
    queryKey: ['superadmin', 'feature-flags'],
    queryFn: featureFlagService.getAll,
  });
};

export const useToggleFlag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ flagId, countryId, enabled }: { flagId: string; countryId: string; enabled: boolean }) =>
      featureFlagService.toggleCountry(flagId, countryId, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'feature-flags'] });
    },
  });
};

export const useToggleFlagLock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (flagId: string) => featureFlagService.toggleLock(flagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'feature-flags'] });
    },
  });
};

export const useFlagImpact = (flagId: string) => {
  return useQuery({
    queryKey: ['superadmin', 'feature-flags', flagId, 'impact'],
    queryFn: () => featureFlagService.getImpact(flagId),
    enabled: !!flagId,
  });
};
