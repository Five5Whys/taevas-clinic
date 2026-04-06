import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { countryService } from '../../services/superadmin/countryService';
import type { CountryConfig } from '../../types/superadmin';

export const useCountries = () => {
  return useQuery({
    queryKey: ['superadmin', 'countries'],
    queryFn: countryService.getAll,
  });
};

export const useCountry = (id: string) => {
  return useQuery({
    queryKey: ['superadmin', 'countries', id],
    queryFn: () => countryService.getById(id),
    enabled: !!id,
  });
};

export const useCreateCountry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CountryConfig>) => countryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'countries'] });
    },
  });
};

export const useUpdateCountry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CountryConfig> }) =>
      countryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'countries'] });
    },
  });
};
