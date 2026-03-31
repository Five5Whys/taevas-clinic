import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/clinicadmin';
export const useClinicDashboard = () => useQuery({ queryKey: ['clinicadmin', 'dashboard'], queryFn: () => dashboardService.getStats() });
