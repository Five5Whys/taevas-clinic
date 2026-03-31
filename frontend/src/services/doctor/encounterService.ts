import api from '../api';
export const encounterService = {
  getByAppointment: async (id: string) => { const r = await api.get(`/doctor/encounters/appointment/${id}`); return r.data.data; },
  create: async (data: any) => { const r = await api.post('/doctor/encounters', data); return r.data.data; },
  update: async (id: string, data: any) => { const r = await api.put(`/doctor/encounters/${id}`, data); return r.data.data; },
};
