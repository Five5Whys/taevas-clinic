import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { importService } from '../../services/clinicadmin';
export const useImportHistory = (params: any = {}) => useQuery({ queryKey: ['clinicadmin', 'import', params], queryFn: () => importService.getHistory(params) });
export const useImportData = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (type: string) => importService.importData(type), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'import'] }) }); };
