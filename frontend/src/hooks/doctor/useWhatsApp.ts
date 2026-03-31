import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { whatsappService } from '../../services/doctor';
export const useWhatsAppConfig = () => useQuery({ queryKey: ['doctor', 'whatsapp'], queryFn: () => whatsappService.getConfig() });
export const useUpdateWhatsAppConfig = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (data: any) => whatsappService.updateConfig(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['doctor', 'whatsapp'] }) }); };
