import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffService } from '../../services/clinicadmin/staffService';
import type { StaffListParams } from '../../services/clinicadmin/staffService';
export const useStaffList = (params: StaffListParams = {}) => useQuery({ queryKey: ['clinicadmin', 'staff', params], queryFn: () => staffService.getAll(params) });
export const useStaff = (id: string) => useQuery({ queryKey: ['clinicadmin', 'staff', id], queryFn: () => staffService.getById(id), enabled: !!id });
export const useCreateStaff = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (data: any) => staffService.create(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'staff'] }) }); };
export const useUpdateStaff = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: any }) => staffService.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'staff'] }) }); };
export const useDeleteStaff = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => staffService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'staff'] }) }); };
