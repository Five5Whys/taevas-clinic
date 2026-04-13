import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portalService } from '../../services/patient';
export const usePatientDashboard = () => useQuery({ queryKey: ['patient', 'dashboard'], queryFn: () => portalService.getDashboard() });
export const usePatientAppointments = (params: any = {}) => useQuery({ queryKey: ['patient', 'appointments', params], queryFn: () => portalService.getAppointments(params) });
export const usePatientPrescriptions = (params: any = {}) => useQuery({ queryKey: ['patient', 'prescriptions', params], queryFn: () => portalService.getPrescriptions(params) });
export const usePatientHealthRecords = () => useQuery({ queryKey: ['patient', 'healthRecords'], queryFn: () => portalService.getHealthRecords() });
export const useUploadHealthRecord = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (formData: FormData) => portalService.uploadHealthRecord(formData), onSuccess: () => qc.invalidateQueries({ queryKey: ['patient', 'healthRecords'] }) });
};
export const useDeleteHealthRecord = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (reportId: string) => portalService.deleteHealthRecord(reportId), onSuccess: () => qc.invalidateQueries({ queryKey: ['patient', 'healthRecords'] }) });
};
export const usePatientFamily = () => useQuery({ queryKey: ['patient', 'family'], queryFn: () => portalService.getFamily() });
export const usePatientProfile = () => useQuery({ queryKey: ['patient', 'profile'], queryFn: () => portalService.getProfile() });
export const useUpdatePatientProfile = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: any) => portalService.updateProfile(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['patient', 'profile'] }) });
};
export const useEmergencyContacts = () => useQuery({ queryKey: ['patient', 'emergency-contacts'], queryFn: () => portalService.listEmergencyContacts() });
export const useAddEmergencyContact = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: any) => portalService.addEmergencyContact(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['patient', 'emergency-contacts'] }) });
};
export const useUpdateEmergencyContact = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ contactId, data }: { contactId: string; data: any }) => portalService.updateEmergencyContact(contactId, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['patient', 'emergency-contacts'] }) });
};
export const useDeleteEmergencyContact = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (contactId: string) => portalService.deleteEmergencyContact(contactId), onSuccess: () => qc.invalidateQueries({ queryKey: ['patient', 'emergency-contacts'] }) });
};
export const useClinicDoctors = () => useQuery({ queryKey: ['patient', 'doctors'], queryFn: () => portalService.getDoctors() });
export const useBookAppointment = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: any) => portalService.bookAppointment(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['patient', 'appointments'] }) });
};
