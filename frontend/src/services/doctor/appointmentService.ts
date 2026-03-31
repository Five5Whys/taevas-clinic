import api from '../api';
export const appointmentService = {
  getAll: async (params: any = {}) => { const r = await api.get('/doctor/appointments', { params }); return r.data.data; },
  getById: async (id: string) => { const r = await api.get(`/doctor/appointments/${id}`); return r.data.data; },
  updateStatus: async (id: string, status: string) => { const r = await api.put(`/doctor/appointments/${id}/status`, null, { params: { status } }); return r.data.data; },
};
