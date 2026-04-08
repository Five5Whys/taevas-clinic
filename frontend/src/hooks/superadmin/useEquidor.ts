import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { equidorService } from '../../services/superadmin/equidorService';
import type { EquidorSessionParams } from '../../services/superadmin/equidorService';

export const useEquidorSessions = (params: EquidorSessionParams = {}) => {
  return useQuery({
    queryKey: ['superadmin', 'equidor', 'sessions', params],
    queryFn: () => equidorService.getSessions(params),
  });
};

export const useEquidorSession = (cid: string) => {
  return useQuery({
    queryKey: ['superadmin', 'equidor', 'sessions', cid],
    queryFn: () => equidorService.getSession(cid),
    enabled: !!cid,
  });
};

export const useEquidorFile = (fileId: string) => {
  return useQuery({
    queryKey: ['superadmin', 'equidor', 'files', fileId],
    queryFn: () => equidorService.getFile(fileId),
    enabled: !!fileId,
  });
};

export const useRetrySession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cid: string) => equidorService.retrySession(cid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'equidor', 'sessions'] });
    },
  });
};
