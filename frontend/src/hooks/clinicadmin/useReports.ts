import { useQuery } from '@tanstack/react-query';
import { reportService } from '../../services/clinicadmin';
export const useClinicReport = () => useQuery({ queryKey: ['clinicadmin', 'reports'], queryFn: () => reportService.getReport() });
