import api from '../api';
export const portalService = {
  getDashboard: async () => { const r = await api.get('/patient/dashboard'); return r.data.data; },
  getAppointments: async (params: any = {}) => { const r = await api.get('/patient/appointments', { params }); const d = r.data.data; return d?.content ?? d; },
  getPrescriptions: async (params: any = {}) => { const r = await api.get('/patient/prescriptions', { params }); const d = r.data.data; return d?.content ?? d; },
  getHealthRecords: async () => { const r = await api.get('/patient/health-records'); return r.data.data; },
  getFamily: async () => { const r = await api.get('/patient/family'); return r.data.data; },
};
