import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localeService } from '../../services/superadmin/localeService';
import type { LocaleSettingsDto } from '../../types/superadmin';

export const useLocaleSettings = (countryId: string) => {
  return useQuery({
    queryKey: ['superadmin', 'locale', countryId],
    queryFn: () => localeService.getByCountry(countryId),
    enabled: !!countryId,
  });
};

export const useUpdateLocale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ countryId, data }: { countryId: string; data: Partial<LocaleSettingsDto> }) =>
      localeService.update(countryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'locale'] });
    },
  });
};
