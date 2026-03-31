import { useQuery } from '@tanstack/react-query';
import { portalService } from '../../services/patient';
export const usePatientDashboard = () => useQuery({ queryKey: ['patient', 'dashboard'], queryFn: () => portalService.getDashboard() });
export const usePatientAppointments = (params: any = {}) => useQuery({ queryKey: ['patient', 'appointments', params], queryFn: () => portalService.getAppointments(params) });
export const usePatientPrescriptions = (params: any = {}) => useQuery({ queryKey: ['patient', 'prescriptions', params], queryFn: () => portalService.getPrescriptions(params) });
export const usePatientHealthRecords = () => useQuery({ queryKey: ['patient', 'healthRecords'], queryFn: () => portalService.getHealthRecords() });
export const usePatientFamily = () => useQuery({ queryKey: ['patient', 'family'], queryFn: () => portalService.getFamily() });
