import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { idFormatService } from '../../services/superadmin/idFormatService';
import { IdFormatTemplateDto } from '../../types/superadmin';

export const useIdFormats = (countryId: string) => {
  return useQuery({
    queryKey: ['superadmin', 'id-formats', countryId],
    queryFn: () => idFormatService.getByCountry(countryId),
    enabled: !!countryId,
  });
};

export const useUpdateIdFormat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      countryId,
      entityType,
      data,
    }: {
      countryId: string;
      entityType: string;
      data: Partial<IdFormatTemplateDto>;
    }) => idFormatService.update(countryId, entityType, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'id-formats'] });
    },
  });
};

export const useToggleIdFormatLock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ countryId, entityType }: { countryId: string; entityType: string }) =>
      idFormatService.toggleLock(countryId, entityType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'id-formats'] });
    },
  });
};
