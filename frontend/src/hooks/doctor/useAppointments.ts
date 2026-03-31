import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../../services/doctor';
export const useDoctorAppointments = (params: any = {}) => useQuery({ queryKey: ['doctor', 'appointments', params], queryFn: () => appointmentService.getAll(params) });
export const useDoctorAppointment = (id: string) => useQuery({ queryKey: ['doctor', 'appointments', id], queryFn: () => appointmentService.getById(id), enabled: !!id });
export const useUpdateAppointmentStatus = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, status }: { id: string; status: string }) => appointmentService.updateStatus(id, status), onSuccess: () => qc.invalidateQueries({ queryKey: ['doctor', 'appointments'] }) }); };
