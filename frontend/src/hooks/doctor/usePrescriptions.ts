import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prescriptionService } from '../../services/doctor';
export const usePrescriptionsByEncounter = (id: string) => useQuery({ queryKey: ['doctor', 'prescriptions', 'encounter', id], queryFn: () => prescriptionService.getByEncounter(id), enabled: !!id });
export const usePrescriptionsByPatient = (id: string, params: any = {}) => useQuery({ queryKey: ['doctor', 'prescriptions', 'patient', id, params], queryFn: () => prescriptionService.getByPatient(id, params), enabled: !!id });
export const useCreatePrescription = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (data: any) => prescriptionService.create(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['doctor', 'prescriptions'] }) }); };
