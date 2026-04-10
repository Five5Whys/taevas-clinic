import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorPatientService } from '../../services/doctor';
export const useDoctorPatients = (params: any = {}) => useQuery({ queryKey: ['doctor', 'patients', params], queryFn: () => doctorPatientService.getAll(params) });
export const useDoctorPatient = (id: string) => useQuery({ queryKey: ['doctor', 'patients', id], queryFn: () => doctorPatientService.getById(id), enabled: !!id });
export const useCreateDoctorPatient = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (data: any) => doctorPatientService.create(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['doctor', 'patients'] }) }); };
export const useUpdateDoctorPatient = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: any }) => doctorPatientService.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['doctor', 'patients'] }) }); };
export const useDeleteDoctorPatient = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => doctorPatientService.remove(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['doctor', 'patients'] }) }); };
