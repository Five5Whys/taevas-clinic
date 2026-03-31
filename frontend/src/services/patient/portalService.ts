import api from '../api';
export const portalService = {
  getDashboard: async () => { const r = await api.get('/patient/dashboard'); return r.data.data; },
  getAppointments: async (params: any = {}) => { const r = await api.get('/patient/appointments', { params }); return r.data.data; },
  getPrescriptions: async (params: any = {}) => { const r = await api.get('/patient/prescriptions', { params }); return r.data.data; },
  getHealthRecords: async () => { const r = await api.get('/patient/health-records'); return r.data.data; },
  getFamily: async () => { const r = await api.get('/patient/family'); return r.data.data; },
};
