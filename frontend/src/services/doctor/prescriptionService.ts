import api from '../api';
export const prescriptionService = {
  getByEncounter: async (id: string) => { const r = await api.get(`/doctor/prescriptions/encounter/${id}`); return r.data.data; },
  getByPatient: async (id: string, params: any = {}) => { const r = await api.get(`/doctor/prescriptions/patient/${id}`, { params }); return r.data.data; },
  create: async (data: any) => { const r = await api.post('/doctor/prescriptions', data); return r.data.data; },
};
