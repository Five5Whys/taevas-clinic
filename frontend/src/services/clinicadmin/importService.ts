import api from '../api';
export const importService = {
  getHistory: async (params: any = {}) => { const r = await api.get('/clinicadmin/import/history', { params }); return r.data.data?.content ?? r.data.data; },
  importData: async (type: string) => { const r = await api.post(`/clinicadmin/import/${type}`); return r.data.data; },
};
