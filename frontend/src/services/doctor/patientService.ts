import api from '../api';
export const doctorPatientService = {
  getAll: async (params: any = {}) => { const r = await api.get('/doctor/patients', { params }); return r.data.data?.content ?? r.data.data; },
  getById: async (id: string) => { const r = await api.get(`/doctor/patients/${id}`); return r.data.data; },
};
