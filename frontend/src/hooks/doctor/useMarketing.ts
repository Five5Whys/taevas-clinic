import { useQuery } from '@tanstack/react-query';
import { marketingService } from '../../services/doctor';
export const useMarketingReviews = (params: any = {}) => useQuery({ queryKey: ['doctor', 'marketing', params], queryFn: () => marketingService.getReviews(params) });
