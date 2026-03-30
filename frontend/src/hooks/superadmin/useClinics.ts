import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clinicService, ClinicListParams } from '../../services/superadmin/clinicService';
import { ClinicSummary } from '../../types/superadmin';

export const useClinics = (params: ClinicListParams = {}) => {
  return useQuery({
    queryKey: ['superadmin', 'clinics', params],
    queryFn: () => clinicService.getAll(params),
  });
};

export const useClinic = (id: string) => {
  return useQuery({
    queryKey: ['superadmin', 'clinics', id],
    queryFn: () => clinicService.getById(id),
    enabled: !!id,
  });
};

export const useCreateClinic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ClinicSummary>) => clinicService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'clinics'] });
    },
  });
};

export const useUpdateClinic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ClinicSummary> }) =>
      clinicService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'clinics'] });
    },
  });
};
