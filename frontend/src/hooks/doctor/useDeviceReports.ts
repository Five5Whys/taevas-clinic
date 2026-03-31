import { useQuery } from '@tanstack/react-query';
import { deviceReportService } from '../../services/doctor';
export const useDoctorDeviceReports = (params: any = {}) => useQuery({ queryKey: ['doctor', 'deviceReports', params], queryFn: () => deviceReportService.getAll(params) });
