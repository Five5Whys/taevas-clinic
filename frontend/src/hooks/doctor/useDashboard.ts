import { useQuery } from '@tanstack/react-query';
import { doctorDashboardService } from '../../services/doctor';
export const useDoctorDashboard = () => useQuery({ queryKey: ['doctor', 'dashboard'], queryFn: () => doctorDashboardService.getStats() });
