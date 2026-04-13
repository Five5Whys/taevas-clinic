import api from '../api';
export const portalService = {
  getDashboard: async () => { const r = await api.get('/patient/dashboard'); return r.data.data; },
  getAppointments: async (params: any = {}) => { const r = await api.get('/patient/appointments', { params }); const d = r.data.data; return d?.content ?? d; },
  getPrescriptions: async (params: any = {}) => { const r = await api.get('/patient/prescriptions', { params }); const d = r.data.data; return d?.content ?? d; },
  getHealthRecords: async () => { const r = await api.get('/patient/health-records'); return r.data.data; },
  uploadHealthRecord: async (formData: FormData) => { const r = await api.post('/patient/health-records', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); return r.data.data; },
  deleteHealthRecord: async (reportId: string) => { const r = await api.delete(`/patient/health-records/${reportId}`); return r.data.data; },
  getFamily: async () => { const r = await api.get('/patient/family'); return r.data.data; },
  getProfile: async () => { const r = await api.get('/patient/profile'); return r.data.data; },
  updateProfile: async (data: any) => { const r = await api.put('/patient/profile', data); return r.data.data; },
  listEmergencyContacts: async () => { const r = await api.get('/patient/emergency-contacts'); return r.data.data; },
  addEmergencyContact: async (data: any) => { const r = await api.post('/patient/emergency-contacts', data); return r.data.data; },
  updateEmergencyContact: async (contactId: string, data: any) => { const r = await api.put(`/patient/emergency-contacts/${contactId}`, data); return r.data.data; },
  deleteEmergencyContact: async (contactId: string) => { const r = await api.delete(`/patient/emergency-contacts/${contactId}`); return r.data.data; },
  getDoctors: async () => { const r = await api.get('/patient/doctors'); return r.data.data; },
  bookAppointment: async (data: any) => { const r = await api.post('/patient/appointments', data); return r.data.data; },
};
