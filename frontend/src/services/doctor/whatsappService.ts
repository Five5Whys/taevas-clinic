import api from '../api';
export const whatsappService = {
  getConfig: async () => { const r = await api.get('/doctor/whatsapp/config'); return r.data.data; },
  updateConfig: async (data: any) => { const r = await api.put('/doctor/whatsapp/config', data); return r.data.data; },
};
