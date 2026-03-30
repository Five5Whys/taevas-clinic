import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fieldService } from '../../services/superadmin/fieldService';
import { FieldDefinitionDto } from '../../types/superadmin';

export const useFields = (section: string, countryId?: string) => {
  return useQuery({
    queryKey: ['superadmin', 'fields', section, countryId],
    queryFn: () => fieldService.getFields(section, countryId),
    enabled: !!section,
  });
};

export const useAddField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<FieldDefinitionDto>) => fieldService.addField(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'fields'] });
    },
  });
};

export const useUpdateField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FieldDefinitionDto> }) =>
      fieldService.updateField(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'fields'] });
    },
  });
};

export const useDeleteField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fieldService.deleteField(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'fields'] });
    },
  });
};

export const useToggleFieldLock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fieldService.toggleLock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'fields'] });
    },
  });
};

export const useReorderFields = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => fieldService.reorderFields(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'fields'] });
    },
  });
};
