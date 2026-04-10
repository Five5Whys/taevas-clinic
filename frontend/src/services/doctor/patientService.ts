import api from '../api';
export const doctorPatientService = {
  getAll: async (params: any = {}) => { const r = await api.get('/doctor/patients', { params }); return r.data.data?.content ?? r.data.data; },
  getById: async (id: string) => { const r = await api.get(`/doctor/patients/${id}`); return r.data.data; },
  create: async (data: any) => { const r = await api.post('/doctor/patients', data); return r.data.data; },
  update: async (id: string, data: any) => { const r = await api.put(`/doctor/patients/${id}`, data); return r.data.data; },
  remove: async (id: string) => { const r = await api.delete(`/doctor/patients/${id}`); return r.data; },
  assignPatients: async (data: { patientIds: string[]; remarks?: string }) => { const r = await api.post('/doctor/patients/assign', data); return r.data; },
  getMyPatients: async (params: { search?: string; page?: number; size?: number }) => { const r = await api.get('/doctor/patients/my-patients', { params }); return r.data; },
  unassignPatient: async (patientId: string) => { const r = await api.delete(`/doctor/patients/unassign/${patientId}`); return r.data; },
};
