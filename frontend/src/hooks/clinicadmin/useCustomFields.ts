import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFieldService } from '../../services/clinicadmin';
export const useCustomFields = () => useQuery({ queryKey: ['clinicadmin', 'customFields'], queryFn: () => customFieldService.getAll() });
export const useCreateCustomField = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (data: any) => customFieldService.create(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'customFields'] }) }); };
export const useUpdateCustomField = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: any }) => customFieldService.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'customFields'] }) }); };
export const useDeleteCustomField = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => customFieldService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'customFields'] }) }); };
