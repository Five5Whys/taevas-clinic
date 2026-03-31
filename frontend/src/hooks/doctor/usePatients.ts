import { useQuery } from '@tanstack/react-query';
import { doctorPatientService } from '../../services/doctor';
export const useDoctorPatients = (params: any = {}) => useQuery({ queryKey: ['doctor', 'patients', params], queryFn: () => doctorPatientService.getAll(params) });
export const useDoctorPatient = (id: string) => useQuery({ queryKey: ['doctor', 'patients', id], queryFn: () => doctorPatientService.getById(id), enabled: !!id });
