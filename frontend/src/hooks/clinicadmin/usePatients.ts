import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService, PatientListParams } from '../../services/clinicadmin/patientService';
export const usePatientList = (params: PatientListParams = {}) => useQuery({ queryKey: ['clinicadmin', 'patients', params], queryFn: () => patientService.getAll(params) });
export const usePatient = (id: string) => useQuery({ queryKey: ['clinicadmin', 'patients', id], queryFn: () => patientService.getById(id), enabled: !!id });
export const useCreatePatient = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (data: any) => patientService.create(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'patients'] }) }); };
export const useUpdatePatient = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: any }) => patientService.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['clinicadmin', 'patients'] }) }); };
