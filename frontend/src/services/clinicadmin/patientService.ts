import api from '../api';
export interface PatientListParams { status?: string; search?: string; page?: number; size?: number; }
export const patientService = {
  getAll: async (params: PatientListParams = {}) => { const r = await api.get('/clinicadmin/patients', { params }); return r.data.data?.content ?? r.data.data; },
  getById: async (id: string) => { const r = await api.get(`/clinicadmin/patients/${id}`); return r.data.data; },
  create: async (data: any) => { const r = await api.post('/clinicadmin/patients', data); return r.data.data; },
  update: async (id: string, data: any) => { const r = await api.put(`/clinicadmin/patients/${id}`, data); return r.data.data; },
};
