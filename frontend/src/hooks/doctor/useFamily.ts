import { useQuery } from '@tanstack/react-query';
import { familyService } from '../../services/doctor';
export const useFamilyByPatient = (id: string) => useQuery({ queryKey: ['doctor', 'family', id], queryFn: () => familyService.getByPatient(id), enabled: !!id });
