import { useQuery } from '@tanstack/react-query';
import { doctorBillingService } from '../../services/doctor';
export const useDoctorBilling = (params: any = {}) => useQuery({ queryKey: ['doctor', 'billing', params], queryFn: () => doctorBillingService.getInvoices(params) });
