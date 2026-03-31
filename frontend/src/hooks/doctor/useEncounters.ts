import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { encounterService } from '../../services/doctor';
export const useEncounterByAppointment = (id: string) => useQuery({ queryKey: ['doctor', 'encounters', id], queryFn: () => encounterService.getByAppointment(id), enabled: !!id });
export const useCreateEncounter = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (data: any) => encounterService.create(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['doctor', 'encounters'] }) }); };
export const useUpdateEncounter = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: any }) => encounterService.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['doctor', 'encounters'] }) }); };
