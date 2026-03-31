import api from '../api';
export const customFieldService = {
  getAll: async () => { const r = await api.get('/clinicadmin/custom-fields'); return r.data.data; },
  create: async (data: any) => { const r = await api.post('/clinicadmin/custom-fields', data); return r.data.data; },
  update: async (id: string, data: any) => { const r = await api.put(`/clinicadmin/custom-fields/${id}`, data); return r.data.data; },
  delete: async (id: string) => { const r = await api.delete(`/clinicadmin/custom-fields/${id}`); return r.data.data; },
};
