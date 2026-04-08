import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rosterService } from '../../services/superadmin/rosterService';
import type { RosterListParams } from '../../services/superadmin/rosterService';

export const useRoster = (params: RosterListParams = {}) => {
  return useQuery({
    queryKey: ['superadmin', 'doctors', params],
    queryFn: () => rosterService.getAll(params),
  });
};

export const useDoctor = (id: string) => {
  return useQuery({
    queryKey: ['superadmin', 'doctors', id],
    queryFn: () => rosterService.getById(id),
    enabled: !!id,
  });
};

export const useUpdateRoles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, roles }: { id: string; roles: string[] }) =>
      rosterService.updateRoles(id, roles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'doctors'] });
    },
  });
};

export const useDeactivateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rosterService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'doctors'] });
    },
  });
};
