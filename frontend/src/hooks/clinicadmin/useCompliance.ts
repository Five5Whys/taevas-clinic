import { useQuery } from '@tanstack/react-query';
import { complianceService } from '../../services/clinicadmin';
export const useComplianceStatus = () => useQuery({ queryKey: ['clinicadmin', 'compliance'], queryFn: () => complianceService.getStatus() });
