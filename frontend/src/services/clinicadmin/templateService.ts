import api from '../api';
export const templateService = {
  getAll: async () => { const r = await api.get('/clinicadmin/templates'); return r.data.data; },
  getByType: async (type: string) => { const r = await api.get(`/clinicadmin/templates/${type}`); return r.data.data; },
  update: async (type: string, data: any) => { const r = await api.put(`/clinicadmin/templates/${type}`, data); return r.data.data; },
};
