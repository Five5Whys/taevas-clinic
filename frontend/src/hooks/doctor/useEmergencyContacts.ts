import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emergencyContactService } from '../../services/doctor';

export const useEmergencyContacts = (patientId: string) =>
  useQuery({ queryKey: ['doctor', 'emergency-contacts', patientId], queryFn: () => emergencyContactService.list(patientId), enabled: !!patientId });

export const useAddEmergencyContact = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ patientId, data }: { patientId: string; data: any }) => emergencyContactService.add(patientId, data),
    onSuccess: (_d, v) => { qc.invalidateQueries({ queryKey: ['doctor', 'emergency-contacts', v.patientId] }); } });
};

export const useUpdateEmergencyContact = (patientId: string) => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ contactId, data }: { contactId: string; data: any }) => emergencyContactService.update(contactId, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['doctor', 'emergency-contacts', patientId] }); } });
};

export const useDeleteEmergencyContact = (patientId: string) => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (contactId: string) => emergencyContactService.delete(contactId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['doctor', 'emergency-contacts', patientId] }); } });
};
