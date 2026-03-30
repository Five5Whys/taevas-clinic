import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/superadmin/dashboardService';

export const useStats = () => {
  return useQuery({
    queryKey: ['superadmin', 'stats'],
    queryFn: dashboardService.getStats,
  });
};

export const useActivity = (page = 0, size = 20) => {
  return useQuery({
    queryKey: ['superadmin', 'activity', page, size],
    queryFn: () => dashboardService.getActivity(page, size),
  });
};

export const useAiInsights = () => {
  return useQuery({
    queryKey: ['superadmin', 'ai-insights'],
    queryFn: dashboardService.getAiInsights,
  });
};
