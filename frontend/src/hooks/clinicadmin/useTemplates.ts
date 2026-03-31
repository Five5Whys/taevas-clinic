import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { templateService } from '../../services/clinicadmin';
export const useTemplates = () => useQuery({ queryKey: ['clinicadmin', 'templates'], queryFn: () => templateService.getAll() });
export const useTemplate = (type: string) => useQuery({ queryKey: ['clinicadmin', 'templates', type], queryFn: () => templateService.getByType(type), enabled: !!type });
export const useUpdateTemplate = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ type, data }: { type: string; data: any }) => templateService.update(type, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'templates'] }) }); };
